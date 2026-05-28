(function (module) {
  "use strict";

  function startsWith(value, prefix) {
    return String(value).indexOf(prefix) === 0;
  }

  function contains(value, fragment) {
    return String(value).indexOf(fragment) !== -1;
  }

  function isEmpty(value) {
    return String(value).length === 0;
  }

  var headerParts = [
    {
      field: "contentType",
      fn: function (part) {
        var lowerPart = part.toLowerCase();

        var match;
        if (startsWith(lowerPart, "content-type:")) {
          var type = part.substring("content-type:".length).trim();
          var regExp = new RegExp("\\w+\/[\\w.\\-\\+]+");
          var matches = regExp.exec(type);
          if (Array.isArray(matches)) {
            match = matches[0];
          }
        }
        return match;
      },
    },
    {
      field: "boundary",
      fn: function (part) {
        var match;
        if (contains(part, "boundary=")) {
          var index = part.indexOf("boundary=");
          var indexSemicolon = part.indexOf(";", index);
          var endIndex = indexSemicolon < 0 ? part.length : indexSemicolon;
          match = part.substring(index + "boundary=".length, endIndex);
          if (match.charAt(0) === '"') {
            match = match.substring(1, match.length - 1);
          }
        }
        return match;
      },
    },
    {
      field: "contentTransferEncoding",
      fn: function (part) {
        var lowerPart = part.toLowerCase();

        var match;
        if (startsWith(lowerPart, "content-transfer-encoding:")) {
          match = part.substring("content-transfer-encoding:".length).trim();
        }
        return match;
      },
    },
    {
      field: "contentDisposition",
      fn: function (part) {
        var lowerPart = part.toLowerCase();

        var match;
        if (startsWith(lowerPart, "content-disposition:")) {
          var type = part.substring("content-disposition:".length).trim();
          var regExp = new RegExp("\\w+");
          var matches = regExp.exec(type);
          if (Array.isArray(matches)) {
            match = matches[0];
          }
        }
        return match;
      },
    },
    {
      field: "filename",
      fn: function (part) {
        var lowerPart = part.toLowerCase();

        var match;
        if (startsWith(lowerPart, "content-disposition:") && contains(lowerPart, 'filename="')) {
          var index = lowerPart.indexOf('filename="');
          var filename = part.substring(index + 'filename="'.length);

          var regExp = new RegExp('[\\w\\W+\\w+][^"]+');
          var matches = regExp.exec(filename);
          if (Array.isArray(matches)) {
            match = matches[0];
          }
        }
        return match;
      },
    },
  ];

  function findDelimiter(content) {
    var delimiter; // Delimiter for Windows, Linux, Mac
    if (startsWith(content, "\r\n")) {
      delimiter = "\r\n";
    } else if (startsWith(content, "\r")) {
      delimiter = "\r";
    } else if (startsWith(content, "\n")) {
      delimiter = "\n";
    } else {
      throw new Error("Multipart: unknown delimiter.");
    }
    return delimiter;
  }

  function parsePart(delimiter, content) {
    var parsed = {};
    parsed.header = parseHeader(delimiter, content);

    var index = content.indexOf(delimiter + delimiter);
    parsed.body = content.substring(index + delimiter.length * 2, content.length - delimiter.length);
    return parsed;
  }

  function parseHeader(delimiter, content) {
    var regExp = new RegExp(delimiter);
    var parts = content.split(regExp);

    var header = { parts: [] };
    if (parts.length < 2) {
      throw new Error("Multipart: cannot parse header with invalid length.");
    } else if (!isEmpty(parts[0])) {
      throw new Error("Multipart: cannot parse header with invalid value.");
    } else if (isEmpty(parts[0]) && isEmpty(parts[1])) {
      header.parts.push("Content-Type: text/plain");
      header.contentType = "text/plain";
      return header;
    }

    for (var i = 1; i < parts.length; i++) {
      var part = parts[i];
      if (isEmpty(part)) {
        return header;
      } else {
        parseHeaderParts(header, part);
        header.parts.push(part);
      }
    }
    return header;
  }

  function parseHeaderParts(header, part) {
    headerParts.forEach(function (one) {
      var value = one.fn(part);
      if (value) {
        header[one.field] = value;
      }
    });
  }

  /**
   * Searches in string to find boundary.
   * @param {String} string - String to search
   * @return {String}
   */
  module.exports.getBoundary = function getBoundary(string) {
    var boundary = "";
    for (var i = 0; i < headerParts.length; i++) {
      var header = headerParts[i];

      if (header.field === "boundary") {
        boundary = header.fn(string);
        break;
      }
    }
    return boundary;
  };

  /**
   * Parses multipart/mixed content (http://www.w3.org/Protocols/rfc1341/7_2_Multipart.html).  This does not parse streams.
   *
   * {
   *  header; {
   *      parts: ['each header line since not all are mapped'],
   *      contentType: 'extracted Content-Type',
   *      contentTransferEncoding: 'extracted Content-Transfer-Encoding',
   *      contentDisposition: 'extracted Content-Disposition',
   *      filename: 'extracted filename'
   *  }
   *  body: 'extracted body from part'
   * }
   *
   * @param {String} boundary - Boundary defined in header
   * @param {String} body - Request body
   */
  module.exports.parseMultipart = function parseMultipart(boundary, body) {
    var dashedBoundary = "--" + boundary;
    var index = body.indexOf(dashedBoundary);
    if (index < 0) {
      throw new Error("Multipart: boundary not found.");
    }

    var delimiter = findDelimiter(body.substring(index + dashedBoundary.length));

    var regExp = new RegExp("--*" + boundary);
    var contents = body.split(regExp);

    var parts = [];
    var lastBoundary = false;
    for (var i = 1; i < contents.length; i++) {
      var content = contents[i];

      if (startsWith(content, "--" + delimiter) || startsWith(content, "--")) {
        lastBoundary = true;
      }

      if (!lastBoundary) {
        parts.push(parsePart(delimiter, content));
      }
    }
    return parts;
  };
})(module);
