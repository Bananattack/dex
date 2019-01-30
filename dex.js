(function(dex) {
    window.dex = dex;

    var toReducedBGR = function(r, g, b, bits) {
        return Math.floor(r * (1 << bits) / 256)
            | (Math.floor(g * (1 << bits) / 256) << bits)
            | (Math.floor(b * (1 << bits) / 256) << (bits * 2));
    }

    var fromReducedBGR = function(color, bits) {
        var r = (color & ((1 << bits) - 1));
        var g = ((color >> bits) & ((1 << bits) - 1));
        var b = ((color >> (bits * 2)) & ((1 << bits) - 1));

        return [Math.floor(r * (256 / (1 << bits)) + r * 255 / (1 << bits) / ((1 << bits) - 1)),
            Math.floor(g * (256 / (1 << bits)) + g * 255 / (1 << bits) / ((1 << bits) - 1)),
            Math.floor(b * (256 / (1 << bits)) + b * 255 / (1 << bits) / ((1 << bits) - 1))
        ];
    }

    var encodeGameboyTiles = function(tileset, size) {
        var bytes = [];
        for(var t = 0; t < tileset.length; t++) {
            var tile = tileset[t];
            for(var i = 0; i < size[1]; i++) {
                var low = 0;
                var high = 0;
                for(var j = 0; j < size[0]; j++) {
                    var color = tile[i * size[0] + j];
                    low = (low << 1) | (color & 0x1);
                    high = (high << 1) | ((color & 0x2) >> 1);
                }
                bytes.push(low, high);
            }
        }
        return bytes;
    }

    var encodeMasterSystemTile = function(tileset, size) {
        var bytes = [];
        for(var t = 0; t < tileset.length; t++) {
            var tile = tileset[t];
            for(var i = 0; i < size[1]; i++) {
                var a = 0;
                var b = 0;
                var c = 0;
                var d = 0;
                for(var j = 0; j < size[0]; j++) {
                    var color = tile[i * size[0] + j];
                    a = (a << 1) | (color & 0x1);
                    b = (b << 1) | ((color & 0x2) >> 1);
                    c = (c << 1) | ((color & 0x4) >> 2);
                    d = (d << 1) | ((color & 0x8) >> 3);
                }
                bytes.push(a, b, c, d);
            }
        }
        return bytes;
    }

    var GameBoySpec = dex.GameBoySpec = function() {
        this.name = 'Game Boy';
        this.sizes = [
            [8, 8],
            [8, 16],
        ];
        this.scanlineSprites = 10;
        this.scanlinePixels = 80;
        this.maxSprites = 40;
        this.paletteColors = 4;
        this.maxPalettes = 2;
        this.alignSprites = true;
        this.colorScheme = {
            to: function(r, g, b) {
                return Math.floor((0.2126 * r + 0.7152 * g + 0.0722 * b) / 64);
            },
            from: function(color) {
                return [Math.floor(color * 255 / 3), Math.floor(color * 255 / 3), Math.floor(color * 255 / 3)];
            }
        }
        this.encoder = {
            encodeTiles: function(tileset, size) {
                return encodeGameboyTiles(tileset, size);
            },

            encodeAttributes: function(image, region, size) {

            }
        }
    }

    var GameBoyColorSpec = dex.GameBoyColorSpec = function() {
        this.name = 'Game Boy Color';
        this.sizes = [
            [8, 8],
            [8, 16],
        ];
        this.scanlineSprites = 10;
        this.scanlinePixels = 80;
        this.maxSprites = 40;
        this.paletteColors = 4;
        this.maxPalettes = 8;
        this.alignSprites = false;
        this.colorScheme = {
            to: function(r, g, b) {
                return toReducedBGR(r, g, b, 5);
            },
            from: function(color) {
                return fromReducedBGR(color, 5);
            }
        }
        this.encoder = {
            encodeTiles: function(tileset, size) {
                return encodeGameboyTiles(tileset, size);
            },

            encodeAttributes: function(image, region, size) {

            }
        }
    }

    var NesSpec = dex.NesSpec = function() {
        this.name = 'NES';
        this.sizes = [
            [8, 8],
            [8, 16],
        ];
        this.scanlineSprites = 8;
        this.scanlinePixels = 64;
        this.maxSprites = 64;
        this.paletteColors = 4;
        this.maxPalettes = 4;
        this.alignSprites = false;

        var nesPalette = [
            [96, 96, 96],
            [0, 0, 112],
            [20, 0, 128],
            [44, 0, 110],
            [74, 0, 78],
            [108, 0, 24],
            [90, 3, 2],
            [81, 24, 0],
            [52, 36, 0],
            [0, 52, 0],
            [0, 50, 0],
            [0, 52, 32],
            [0, 44, 120],
            [0, 0, 0],
            [2, 2, 2],
            [2, 2, 2],
            [196, 196, 196],
            [0, 88, 222],
            [48, 31, 252],
            [127, 20, 224],
            [168, 0, 176],
            [192, 6, 92],
            [192, 43, 14],
            [166, 64, 16],
            [111, 97, 0],
            [48, 128, 0],
            [0, 124, 0],
            [0, 124, 60],
            [0, 110, 132],
            [20, 20, 20],
            [4, 4, 4],
            [4, 4, 4],
            [240, 240, 240],
            [76, 170, 255],
            [111, 115, 245],
            [176, 112, 255],
            [218, 90, 255],
            [240, 96, 192],
            [248, 131, 109],
            [208, 144, 48],
            [212, 192, 48],
            [102, 208, 0],
            [38, 221, 26],
            [46, 200, 102],
            [52, 194, 190],
            [84, 84, 84],
            [6, 6, 6],
            [6, 6, 6],
            [255, 255, 255],
            [182, 218, 255],
            [200, 202, 255],
            [218, 194, 255],
            [240, 190, 255],
            [252, 188, 238],
            [255, 208, 180],
            [255, 218, 144],
            [236, 236, 146],
            [220, 246, 158],
            [184, 255, 162],
            [174, 234, 190],
            [158, 239, 239],
            [190, 190, 190],
            [8, 8, 8],
            [8, 8, 8]
        ];

        this.colorScheme = {
            to: function(r, g, b) {
                var closestDistance = null;
                var closestIndex = null;

                var lum = (0.2126 * r + 0.7152 * g + 0.0722 * b);

                for(var i = 0; i < nesPalette.length; i++) {
                    var c = nesPalette[i];
                    var x = (r - c[0]);
                    var y = (g - c[1]);
                    var z = (b - c[2]);
                    var w = (lum - (0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]));

                    var distance = Math.sqrt(x * x * 3 + y * y * 6 + z * z + w * w);
                    if(closestDistance == null || distance < closestDistance) {
                        closestDistance = distance;
                        closestIndex = i;
                    }
                }
                if(closestIndex == 0x0D) {
                    closestIndex = 0x0F;
                }
                return closestIndex;
            },
            from: function(color) {
                return nesPalette[color];
            }
        };
        this.encoder = {
            encodeTiles: function(tileset, size) {
                var bytes = [];
                for(var t = 0; t < tileset.length; t++) {
                    var tile = tileset[t];
                    for(var i = 0; i < size[1]; i++) {
                        var low = 0;
                        var high = 0;
                        for(var j = 0; j < size[0]; j++) {
                            var color = tile[i * size[0] + j];
                            low = (low << 1) | (color & 0x1);
                            high = (high << 1) | ((color & 0x2) >> 1);
                        }
                        bytes.push(low, high);
                    }
                }
                return bytes;
            },

            encodeAttributes: function(image, region, size) {

            }
        }
    }

    var SnesSpec = dex.SnesSpec = function() {
        this.name = 'SNES';
        this.sizes = [
            [8, 8],
            [16, 16],
            [32, 32],
            [64, 64]
        ];
        this.scanlineSprites = 32;
        this.scanlinePixels = 272;
        this.maxSprites = 128;
        this.paletteColors = 16;
        this.maxPalettes = 8;
        this.alignSprites = false;
        this.colorScheme = {
            to: function(r, g, b) {
                return toReducedBGR(r, g, b, 5);
            },
            from: function(color) {
                return fromReducedBGR(color, 5);
            }
        }
        this.encoder = {
            encodeTiles: function(tileset, size) {
                var bytes = [];
                for(var t = 0; t < tileset.length; t++) {
                    var tile = tileset[t];
                    for(var i = 0; i < size[1]; i++) {
                        var a = 0;
                        var b = 0;
                        for(var j = 0; j < size[0]; j++) {
                            var color = tile[i * size[0] + j];
                            a = (a << 1) | (color & 0x1);
                            b = (b << 1) | ((color & 0x2) >> 1);
                        }
                        bytes.push(a, b);
                    }
                    for(var i = 0; i < size[1]; i++) {
                        var a = 0;
                        var b = 0;
                        for(var j = 0; j < size[0]; j++) {
                            var color = tile[i * size[0] + j];
                            a = (a << 1) | ((color & 0x4) >> 2);
                            b = (b << 1) | ((color & 0x8) >> 3);
                        }
                        bytes.push(a, b);
                    }
                }
                return bytes;
            },

            encodeAttributes: function(image, region, size) {

            }
        }
    }

    var PceSpec = dex.PceSpec = function() {
        this.name = 'PC Engine';
        this.sizes = [
            [16, 16],
            [16, 32],
            [16, 64],
            [32, 16],
            [32, 32],
            [32, 64]
        ];
        this.scanlinePixels = 256;
        this.scanlineSprites = 16;
        this.maxSprites = 64;
        this.paletteColors = 16;
        this.maxPalettes = 16;
        this.alignSprites = false;
        this.colorScheme = {
            to: function(r, g, b) {
                // rgb24 -> bgr9
                var color = toReducedBGR(r, g, b, 3);
                // bgr9 -> grb9
                color = (color << 3) & 0x1F8 | ((color >> 6) & 0x7); 
                return color;
            },
            from: function(color) {
                // grb9 -> bgr9
                color = (color >> 3) & 0x3F | ((color & 0x7) << 6); 
                // bgr9 -> rgb24
                return fromReducedBGR(color, 3);
            }
        };
        this.encoder = {
            encodeTiles: function(tileset, size) {
                var bytes = [];
                for(var t = 0; t < tileset.length; t++) {
                    var tile = tileset[t];
                    for(var n = 0; n < 4; n++) {
                        for(var i = 0; i < size[1]; i++) {
                            var plane = 0;
                            for(var j = 0; j < size[0]; j++) {
                                var color = tile[i * size[0] + j];
                                plane = (plane << 1) | ((color & (1 << n)) >> n);
                            }
                            bytes.push(plane & 0xFF, (plane >> 8) & 0xFF);
                        }
                    }
                }
                return bytes;
            },

            encodeAttributes: function(image, region, size) {

            }
        }
    }

    var SmsSpec = dex.MasterSystemSpec = function() {
        this.name = 'Master System';
        this.sizes = [
            [8, 8],
            [8, 16]
        ];
        this.scanlinePixels = 64;
        this.scanlineSprites = 8;
        this.maxSprites = 64;
        this.paletteColors = 16;
        this.maxPalettes = 1;
        this.alignSprites = false;
        this.colorScheme = {
            to: function(r, g, b) {
                return toReducedBGR(r, g, b, 2);
            },
            from: function(color) {
                return fromReducedBGR(color, 2);
            }
        };
        this.encoder = {
            encodeTiles: function(tileset, size) {
                return encodeMasterSystemTile(tileset, size);
            },

            encodeAttributes: function(image, region, size) {

            }
        }
    }

    var GameGearSpec = dex.GameGearSpec = function() {
        this.name = 'Game Gear';
        this.sizes = [
            [8, 8],
            [8, 16]
        ];
        this.scanlinePixels = 64;
        this.scanlineSprites = 8;
        this.maxSprites = 64;
        this.paletteColors = 16;
        this.maxPalettes = 1;
        this.alignSprites = false;
        this.colorScheme = {
            to: function(r, g, b) {
                return toReducedBGR(r, g, b, 4);
            },
            from: function(color) {
                return fromReducedBGR(color, 4);
            }
        };
        this.encoder = {
            encodeTiles: function(tileset, size) {
                return encodeMasterSystemTile(tileset, size);
            },

            encodeAttributes: function(image, region, size) {

            }
        }
    }


    var platforms = dex.platforms = [
        ['gb', new dex.GameBoySpec()],
        ['gbc', new dex.GameBoyColorSpec()],
        ['nes', new dex.NesSpec()],
        ['snes', new dex.SnesSpec()],
        ['pce', new dex.PceSpec()],
        ['sms', new dex.MasterSystemSpec()],
        ['gg', new dex.GameGearSpec()]
    ];

    var platformsByName = dex.platformsByName = {};
    (function() {
        for(var i = 0; i < platforms.length; i++) {
            platformsByName[platforms[i][0]] = platforms[i][1];
        }
    })();

    var IndexedImage = dex.IndexedImage = function(colorTable, palette, frames) {
        this.colorTable = colorTable;
        this.palette = palette;
        this.frames = frames;
    }

    dex.framesToIndexedImage = function(spec, frames) {
        var colorScheme = spec.colorScheme;

        // Build the color table.
        var colorTable = {};
        for(var i = 0; i < frames.length; i++) {
            var context = frames[i].context;
            var pixels = context.getImageData(0, 0, context.canvas.width, context.canvas.height);
            for(var k = 0, length = pixels.width * pixels.height * 4; k < length; k += 4) {
                var color;

                // Reduce all translucent/transparent pixels to transparent.
                if(pixels.data[k + 3] < 255) {
                    pixels.data[k + 0] = 0;
                    pixels.data[k + 1] = 0;
                    pixels.data[k + 2] = 0;
                    pixels.data[k + 3] = 0;
                    color = 'transparent';
                } else {
                    color = colorScheme.to(pixels.data[k + 0], pixels.data[k + 1], pixels.data[k + 2]);
                }

                if(!colorTable[color]) {
                    colorTable[color] = {count: 1};
                } else {
                    colorTable[color].count++;
                }
            }
        }

        // Force transparency to be an entry.
        colorTable['transparent'] = colorTable['transparent'] || {count: 0};

        // Generate a palette from the color table.
        var palette = [];
        for(var k in colorTable) {
            palette.push({
                color: k,
                count: colorTable[k].count
            });
        }

        // Put transparencies first, then order descending by count and color index.
        // (Ascending by alpha will guarantee transparency is color 0.)
        palette.sort(function(u, v) {
            if(u.color == 'transparent'
            || v.color == 'transparent') {
                if(u.color == v.color) {
                    return 0;
                } else {
                    return u.color == 'transparent' ? -1 : 1;
                }
            } else if(v.count != u.count) {
                return v.count - u.count;
            } else if(v.color != u.color) {
                return v.color - u.color;
            } else {
                return 0;
            }
        });

        // Store the index of each palette entry in the color table.
        for(var i = 0; i < palette.length; i++) {
            colorTable[palette[i].color].index = i;
        }

        // Finally convert to an indexed-color version of each frame.
        var indexedFrames = new Array(frames.length);
        for(var f = 0; f < frames.length; f++) {
            var context = frames[f].context;
            var pixels = context.getImageData(0, 0, context.canvas.width, context.canvas.height);
            var indices = {width: pixels.width, height: pixels.height, data: new Array(pixels.width * pixels.height)};

            for(var i = 0; i < pixels.height; i++) {
                for(var j = 0; j < pixels.width; j++) {
                    var k = (i * pixels.width + j) * 4;

                    var color;
                    if(pixels.data[k + 3] < 255) {
                        color = 'transparent' 
                    } else {
                        color = colorScheme.to(pixels.data[k + 0], pixels.data[k + 1], pixels.data[k + 2]);
                        var rgb = colorScheme.from(color);
                        pixels.data[k + 0] = rgb[0];
                        pixels.data[k + 1] = rgb[1];
                        pixels.data[k + 2] = rgb[2];
                    }
                    indices.data[i * pixels.width + j] = colorTable[color].index;
                }
            }

            context.putImageData(pixels, 0, 0);

            indexedFrames[f] = indices;
        }

        return new IndexedImage(colorTable, palette, indexedFrames);
    }

    var ImageRegion = dex.ImageRegion = function(x, y, width, height, pixels, colorCounts) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.pixels = pixels;
        this.colorCounts = colorCounts;
    }

    var grabImageRegion = function(pixels, visited, predicate, x, y, w, h) {
        var tilePixels = [];
        var tileColorCounts = {};

        var x2 = x + w;
        var y2 = y + h;
        for(var i = y; i < y2; i++) {
            for(var j = x; j < x2; j++) {
                var color = null;
                if(i >= 0 && i < pixels.height && j >= 0 && j < pixels.width) {
                    var k = i * pixels.width + j;

                    visited[k] = 1;
                    if(predicate(pixels.data, k)) {
                        color = pixels.data[k];
                    }
                }

                color = color || 0;

                tilePixels.push(color);
                if(!tileColorCounts[color]) {
                    tileColorCounts[color] = 1;
                } else {
                    tileColorCounts[color]++;
                }
            }
        }
     
        return new ImageRegion(x, y, w, h, tilePixels, tileColorCounts);
    }

    var findUnvisitedRow = function(pixels, visited, predicate) {
        // Look for for first row with an unvisited opaque pixel in it.
        for(var i = 0; i < pixels.height; i++) {
            for(var j = 0; j < pixels.width; j++) {
                var k = i * pixels.width + j;
                if(predicate(pixels.data, k) && !visited[k]) {
                    return i;
                }
            }
        }
        return -1;
    }

    var findUnvisitedColumn = function(pixels, visited, predicate) {
        // Look for for first column with an unvisited opaque pixel in it.
        for(var j = 0; j < pixels.width; j++) {
            for(var i = 0; i < pixels.height; i++) {
                var k = i * pixels.width + j;
                if(predicate(pixels.data, k) && !visited[k]) {
                    return j;
                }
            }
        }
        return -1;
    }

    var findRegionDecompositions = function(image, size, predicate) {
        var decompositions = [];
        var frames = image.frames;

        for(var f = 0; f < frames.length; f++) {
            var rowFirstDecomposition = [];
            var columnFirstDecomposition = [];
            var pixels = image.frames[f];
            var visited = new Array(pixels.width * pixels.height);

            for(var i = 0; i < pixels.width * pixels.height; i++) {
                visited[i] = 0;
            }

            var y = findUnvisitedRow(pixels, visited, predicate);
            while(y >= 0) {
                var y2 = Math.min(y + size[1], pixels.height);

                for(var j = 0; j < pixels.width; j++) {
                    var match = false;
                    // Find if any pixel in the 1 x th column is unvisited and opaque
                    for(var i = y; i < y2; i++) {
                        if(predicate(pixels.data, i * pixels.width + j) && !visited[i * pixels.width + j]) {
                            match = true;
                            break;
                        }
                    }
                    if(match) {
                        var region = grabImageRegion(pixels, visited, predicate, j, y, size[0], size[1]);
                        rowFirstDecomposition.push(region);
                    }
                }

                y = findUnvisitedRow(pixels, visited, predicate);
            }

            for(var i = 0; i < pixels.width * pixels.height; i++) {
                visited[i] = 0;
            }

            var x = findUnvisitedColumn(pixels, visited, predicate);
            while(x >= 0) {
                var x2 = Math.min(x + size[0], pixels.width);

                for(var i = 0; i < pixels.height; i++) {
                    var match = false;
                    // Find if any pixel in the tw x 1 row is unvisited and opaque
                    for(var j = x; j < x2; j++) {
                        if(predicate(pixels.data, i * pixels.width + j) && !visited[i * pixels.width + j]) {
                            match = true;
                            break;
                        }
                    }
                    if(match) {
                        var region = grabImageRegion(pixels, visited, predicate, x, i, size[0], size[1]);
                        columnFirstDecomposition.push(region);
                    }
                }

                x = findUnvisitedColumn(pixels, visited, predicate);
            }

            // Take the decomposition that required less image regions to recreate.
            decompositions.push(columnFirstDecomposition.length < rowFirstDecomposition.length ? columnFirstDecomposition : rowFirstDecomposition);
        }
        return decompositions;
    }

    var findGlobalRegionDecompositions = dex.findGlobalRegionDecompositions = function(image, size) {
        return findRegionDecompositions(image, size, function(data, index) {
            return image.palette[data[index]].color != 'transparent';
        });
    }

    var findBestSharedColor = function(spritePalette, usedColors, decompositions) {
        var aggregateCounts = {};
        for(var d = 0; d < decompositions.length; d++) {
            var decomposition = decompositions[d];
            for(var i = 0; i < decomposition.length; i++) {
                var localCounts = decomposition[i].colorCounts;
                var admissible = true;
                for(var j = 0; j < spritePalette.length; j++) {
                    if(!localCounts[spritePalette[j]]) {
                        admissible = false;
                        break;
                    }
                }
                if(admissible) {
                    for(color in localCounts) {
                        aggregateCounts[color] = (aggregateCounts[color] || 0) + localCounts[color];
                    }
                }
            }
        }

        var bestColor = null;
        for(color in aggregateCounts) {
            if(!usedColors[color] && (!bestColor || aggregateCounts[color] > aggregateCounts[bestColor])) {
                bestColor = +color;
            }
        }

        return bestColor;
    }

    var findSpritePalettes = dex.findSpritePalettes = function(image, spec, decompositions) {
        var globalPalette = image.palette;
        var spritePalettes = [];
        var usedColors = {};

        // Transparency appears in every sprite palette, so rule it out as a best-match candidate.
        for(var i = 0; i < globalPalette.length; i++) {
            if(globalPalette[i].color == 'transparent') {
                usedColors[i] = true;
            }
        }

        while(true) {
            // Create a new palette.
            var spritePalette = [];

            // Find a frequently used color from the global palette.
            for(var i = 0; i < globalPalette.length; i++) {
                if(globalPalette[i].color != 'transparent' && !usedColors[i]) {
                    usedColors[i] = true;
                    spritePalette.push(i);
                    break;
                }
            }

            // All colors accounted for!
            if(i == globalPalette.length) {
                var pal = spritePalettes[spritePalettes.length - 1];
                while(pal.length < spec.paletteColors) {
                    pal.push(0);
                }

                return spritePalettes;
            }

            // Find colors that are frequently used with the palette made so far.
            while(spritePalette.length < spec.paletteColors - 1) {
                var color = findBestSharedColor(spritePalette, usedColors, decompositions);
                if(color) {
                    usedColors[color] = true;
                    spritePalette.push(color);
                } else {
                    break;
                }
            }

            // If we ran out of things in common, go back to frequently used global colors.
            while(spritePalette.length < spec.paletteColors - 1) {
                for(var i = 0; i < globalPalette.length; i++) {
                    if(globalPalette[i].color != 'transparent' && !usedColors[i]) {
                        usedColors[i] = true;
                        spritePalette.push(i);
                        break;
                    }
                }
                if(i == globalPalette.length) {
                    break;
                }
            }

            spritePalette.sort(function(a, b) {
                return globalPalette[a].color - globalPalette[b].color;
            });

            // Add transparency as index 0.
            spritePalette.unshift(0);

            spritePalettes.push(spritePalette);
        }
    }

    var findIndexTables = function(spritePalettes) {
        var indexTables = [];
        for(var p = 0; p < spritePalettes.length; p++) {
            var spritePalette = spritePalettes[p];
            var indexTable = {};
            for(var i = 0; i < spritePalette.length; i++) {
                if(typeof(indexTable[spritePalette[i]]) === 'undefined') {
                    indexTable[spritePalette[i]] = i;
                }
            }
            indexTables.push(indexTable);
        }
        return indexTables;
    }

    var Sprite = dex.Sprite = function(x, y, paletteIndex, pixels, hflip, vflip) {
        this.x = x;
        this.y = y;
        this.paletteIndex = paletteIndex;
        this.pixels = pixels;
        this.tileIndex = -1;
        this.hflip = false;
        this.vflip = false;
    }

    var findAlignedMetasprites = findAlignedMetasprites = function(spritePalettes, decompositions) {
        var indexTables = findIndexTables(spritePalettes);

        var metasprites = [];

        for(var d = 0; d < decompositions.length; d++) {
            var decomposition = decompositions[d];
            var metasprite = [];

            for(var i = 0; i < decomposition.length; i++) {
                var region = decomposition[i];
                var pixels = region.pixels;

                for(var p = 0; p < spritePalettes.length; p++) {
                    var indexTable = indexTables[p];
                    var admissible = false;
                    for(var k = 0; k < pixels.length; k++) {
                        if(indexTable[pixels[k]]) {
                            admissible = true;
                        }
                    }

                    if(admissible) {
                        var indices = new Array(pixels.length);
                        for(var k = 0; k < pixels.length; k++) {
                            indices[k] = indexTable[pixels[k]] || 0;
                        }
                        metasprite.push(new Sprite(region.x, region.y, p, indices));
                    }
                }
            }

            metasprite.sort(function(a, b) {
                if(a.y != b.y) {
                    return a.y - b.y;
                } else if(a.x != b.x) {
                    return a.x - b.x;
                } else if(a.paletteIndex != b.paletteIndex) {
                    return a.paletteIndex - b.paletteIndex;
                } else {
                    return 0;
                }
            });

            metasprites.push(metasprite);
        }

        return metasprites;
    }

    var findUnalignedMetasprites = findUnalignedMetasprites = function(image, size, spritePalettes) {
        var indexTables = findIndexTables(spritePalettes);

        var decompositionsByPalette = new Array(spritePalettes.length);

        for(var p = 0; p < spritePalettes.length; p++) {
            var indexTable = indexTables[p];
            decompositionsByPalette[p] = findRegionDecompositions(image, size, function(data, index) {
                var p = data[index];
                return image.palette[data[index]].color != 'transparent' && indexTable[data[index]];
            });
        }

        // Flatten: arr[pal][frame] -> arr[frame]
        var metasprites = [];
        var frames = image.frames;
        for(var f = 0; f < frames.length; f++) {
            var metasprite = [];
            for(var p = 0; p < spritePalettes.length; p++) {
                var indexTable = indexTables[p];
                var decomposition = decompositionsByPalette[p][f];
                for(var i = 0; i < decomposition.length; i++) {
                    var region = decomposition[i];
                    var pixels = region.pixels;
                    var indices = new Array(pixels.length);
                    for(var k = 0; k < pixels.length; k++) {
                        indices[k] = indexTable[pixels[k]] || 0;
                    }
                    metasprite.push(new Sprite(region.x, region.y, p, indices));
                }
            }

            metasprite.sort(function(a, b) {
                if(a.y != b.y) {
                    return a.y - b.y;
                } else if(a.x != b.x) {
                    return a.x - b.x;
                } else if(a.paletteIndex != b.paletteIndex) {
                    return a.paletteIndex - b.paletteIndex;
                } else {
                    return 0;
                }
            });

            metasprites.push(metasprite);
        }

        return metasprites;
    }

    dex.findMetasprites = function(image, spec, size, spritePalettes, decompositions) {
        if(spec.alignSprites) {
            return findAlignedMetasprites(spritePalettes, decompositions);
        } else {
            return findUnalignedMetasprites(image, size, spritePalettes);
        }
    }

    var findTileset = dex.findTileset = function(image, size, metasprites) {
        var tileTable = {};

        var tileset = [];

        for(var f = 0; f < metasprites.length; f++) {
            var metasprite = metasprites[f];
            for(var m = 0; m < metasprite.length; m++) {
                var sprite = metasprite[m];
                var pixels = sprite.pixels;

                var match = tileTable[pixels.join(',')];
                if(match) {
                    sprite.tileIndex = match.tileIndex;
                    sprite.hflip = match.hflip;
                    sprite.vflip = match.vflip;
                } else {
                    for(var c = 0; c < 4; c++) {
                        var hflip = (c & 0x1) != 0;
                        var vflip = (c & 0x2) != 0;

                        if(hflip || vflip) {
                            pixels = Array.prototype.slice.call(sprite.pixels);
                        }

                        if(hflip) {
                            for(var i = 0; i < size[1]; i++) {
                                for(var j = 0; j < size[0] / 2; j++) {
                                    var k = i * size[0] + j;
                                    var k2 = i * size[0] + (size[0] - j - 1);
                                    var t = pixels[k];
                                    pixels[k] = pixels[k2];
                                    pixels[k2] = t;
                                }
                            }
                        }

                        if(vflip) {
                            for(var i = 0; i < size[1] / 2; i++) {
                                for(var j = 0; j < size[0]; j++) {
                                    var k = i * size[0] + j;
                                    var k2 = (size[1] - i - 1) * size[0] + j;
                                    var t = pixels[k];
                                    pixels[k] = pixels[k2];
                                    pixels[k2] = t;
                                }
                            }
                        }

                        tileTable[pixels.join(',')] = {
                            tileIndex: tileset.length,
                            hflip: hflip,
                            vflip: vflip,
                            pixels: pixels
                        };
                    }

                    sprite.tileIndex = tileset.length;

                    tileset.push(sprite.pixels);
                }
            }
        }

        return tileset;
    }

    var createTilesetCanvas = dex.createTilesetCanvas = function(spec, size, tileset) {
        var canvas = document.createElement('canvas');

        var tilesPerRow = Math.min(tileset.length, 16);
        canvas.width = size[0] * tilesPerRow;
        canvas.height = size[1] * Math.floor(tileset.length / tilesPerRow);

        var context = canvas.getContext('2d');
        var pixels = context.getImageData(0, 0, context.canvas.width, context.canvas.height);
        console.log(pixels.width, pixels.height);

        for(var t = 0; t < tileset.length; t++) {
            var tile = tileset[t];
            for(var i = 0; i < size[1]; i++) {
                for(var j = 0; j < size[0]; j++) {
                    var k = (Math.floor(t / tilesPerRow) * size[1] + i) * canvas.width + (t % tilesPerRow) * size[0] + j;
                    var value = Math.floor(tile[i * size[0] + j] * 255 / (spec.paletteColors - 1));
                    pixels.data[k * 4 + 0] = value;
                    pixels.data[k * 4 + 1] = value;
                    pixels.data[k * 4 + 2] = value;
                    pixels.data[k * 4 + 3] = 255;
                }
            }
        }

        context.putImageData(pixels, 0, 0);
        return canvas;
    }

    var generatePaletteTable = dex.generatePaletteTable = function(image, spec, spritePalettes) {
        var colorScheme = spec.colorScheme;
        var table = document.createElement('table');        
        table.className = 'sprite_palettes';
        for(var i = 0; i < spritePalettes.length; i++) {
            var palette = spritePalettes[i];

            var tr = document.createElement('tr');
            tr.className = 'sprite_palette';
            for(var j = 0; j < palette.length; j++) {
                var td = document.createElement('td');
                var div = document.createElement('div');
                div.className = 'color';

                var color = image.palette[palette[j]].color;
                if(color == 'transparent') {
                    div.style.backgroundColor = 'rgba(0, 0, 0, 0)';
                } else {
                    div.style.backgroundColor = 'rgba(' + colorScheme.from(color).join(',') + ', 1)';
                }
                td.appendChild(div);
                tr.appendChild(td);
            }
            table.appendChild(tr);
        }
        return table;
    }    

    var encodeTiles = dex.encodeTiles = function(spec, size, tileset) {
        var bytes = spec.encoder.encodeTiles(tileset, size);
        var buffer = new Uint8Array(new ArrayBuffer(bytes.length));
        for(var i = 0; i < bytes.length; i++) {
            buffer[i] = bytes[i];
        }
        return new Blob([buffer], {type: "application/octet-stream"});
    }

})({});