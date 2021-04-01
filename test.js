const data = [{"type":"M","x":868.5,"y":219},{"type":"h","x":-40},{"type":"v","y":33},{"type":"h","x":-63},{"type":"v","y":-31},{"type":"h","x":-50},{"type":"v","y":-73},{"type":"l","x":7,"y":-19},{"type":"h","x":22},{"type":"l","x":-45,"y":-45},{"type":"h","x":-24},{"type":"v","y":20},{"type":"l","x":-12,"y":24},{"type":"h","x":-61},{"type":"V","y":96},{"type":"l","x":-59,"y":-61},{"type":"h","x":-133},{"type":"l","x":-41,"y":40},{"type":"v","y":54},{"type":"h","x":-182},{"type":"v","y":-28},{"type":"h","x":-73},{"type":"l","x":-25,"y":20},{"type":"h","x":78},{"type":"v","y":46},{"type":"h","x":-49},{"type":"l","x":-10,"y":10},{"type":"h","x":-19},{"type":"v","y":15},{"type":"h","x":43},{"type":"v","y":73},{"type":"h","x":-36},{"type":"v","y":-33},{"type":"h","x":-33},{"type":"v","y":-36},{"type":"h","x":-20},{"type":"l","x":-26,"y":23},{"type":"v","y":20},{"type":"l","x":30,"y":34},{"type":"v","y":8},{"type":"l","x":-29,"y":28},{"type":"v","y":25},{"type":"l","x":23,"y":16},{"type":"h","x":20},{"type":"v","y":-36},{"type":"h","x":34},{"type":"v","y":-27},{"type":"h","x":36},{"type":"v","y":73},{"type":"h","x":-42},{"type":"v","y":18},{"type":"h","x":79},{"type":"v","y":46},{"type":"h","x":-51},{"type":"l","x":-8,"y":10},{"type":"h","x":-18},{"type":"l","x":23,"y":19},{"type":"h","x":72},{"type":"v","y":-34},{"type":"h","x":46},{"type":"v","y":59},{"type":"h","x":160},{"type":"v","y":8},{"type":"l","x":43,"y":42},{"type":"h","x":83},{"type":"v","y":-97},{"type":"h","x":73},{"type":"v","y":33},{"type":"h","x":-60},{"type":"v","y":43},{"type":"l","x":21,"y":21},{"type":"h","x":63},{"type":"l","x":21,"y":-21},{"type":"v","y":-44},{"type":"h","x":-14},{"type":"v","y":-32},{"type":"h","x":42},{"type":"l","x":20,"y":21},{"type":"v","y":7},{"type":"h","x":-30},{"type":"v","y":10},{"type":"l","x":28,"y":1},{"type":"v","y":4},{"type":"h","x":18},{"type":"l","x":13,"y":-13},{"type":"v","y":-16},{"type":"l","x":9,"y":-10},{"type":"v","y":-18},{"type":"l","x":-9,"y":-12},{"type":"v","y":-17},{"type":"h","x":31},{"type":"v","y":-8},{"type":"h","x":-32},{"type":"v","y":-71},{"type":"h","x":53},{"type":"v","y":-35},{"type":"h","x":63},{"type":"v","y":28},{"type":"h","x":40},{"type":"l","x":34,"y":-27},{"type":"v","y":-31},{"type":"L","x":868.5,"y":219},{"type":"z"},{"type":"M","x":424.5,"y":352},{"type":"l","x":-33,"y":27},{"type":"v","y":78},{"type":"h","x":-79},{"type":"v","y":-36},{"type":"h","x":31},{"type":"l","x":21,"y":-21},{"type":"v","y":-42},{"type":"l","x":24,"y":-24},{"type":"v","y":-4},{"type":"h","x":-73},{"type":"v","y":-6},{"type":"h","x":-28},{"type":"v","y":34},{"type":"h","x":52},{"type":"v","y":21},{"type":"h","x":-53},{"type":"v","y":78},{"type":"h","x":-28},{"type":"v","y":-60},{"type":"h","x":-71},{"type":"v","y":-37},{"type":"h","x":-29},{"type":"v","y":-71},{"type":"h","x":37},{"type":"v","y":26},{"type":"h","x":55},{"type":"v","y":-82},{"type":"l","x":-17,"y":-16},{"type":"h","x":-18},{"type":"l","x":-21,"y":21},{"type":"v","y":26},{"type":"h","x":-36},{"type":"v","y":-70},{"type":"h","x":30},{"type":"v","y":-41},{"type":"h","x":101},{"type":"v","y":12},{"type":"h","x":-25},{"type":"v","y":97},{"type":"l","x":17,"y":21},{"type":"h","x":111},{"type":"v","y":-27},{"type":"l","x":-38,"y":-37},{"type":"v","y":-54},{"type":"h","x":-30},{"type":"v","y":-12},{"type":"h","x":44},{"type":"v","y":50},{"type":"l","x":52,"y":52},{"type":"h","x":50},{"type":"l","x":1,"y":97},{"type":"H","x":424.5},{"type":"z"},{"type":"M","x":737.5,"y":289},{"type":"h","x":-52},{"type":"v","y":106},{"type":"l","x":-15,"y":14},{"type":"h","x":-152},{"type":"v","y":-58},{"type":"h","x":-20},{"type":"v","y":-29},{"type":"h","x":43},{"type":"v","y":55},{"type":"h","x":87},{"type":"l","x":17,"y":-18},{"type":"v","y":-58},{"type":"h","x":-147},{"type":"v","y":-47},{"type":"h","x":52},{"type":"l","x":53,"y":-54},{"type":"v","y":-49},{"type":"h","x":46},{"type":"v","y":2},{"type":"h","x":26},{"type":"l","x":8,"y":5},{"type":"v","y":65},{"type":"h","x":-57},{"type":"l","x":-9,"y":9},{"type":"h","x":-9},{"type":"l","x":-21,"y":24},{"type":"h","x":75},{"type":"v","y":-10},{"type":"h","x":75},{"type":"V","y":289},{"type":"z"}];
const output = [];
let last = {x: 0, y: 0};
for (const d of data) {
    if (d.type == "M") {
        last = {x: d.x, y: d.y};
        continue;
    } else if (d.type == "h") {
        output.push({ x1: last.x, y1: last.y, x2: last.x + d.x, y2: last.y });
        last = { x: last.x + d.x, y: last.y };
    } else if (d.type == "v") {
        output.push({ x1: last.x, y1: last.y, x2: last.x, y2: last.y + d.y });
        last = { x: last.x, y: last.y + d.y };
    } else if (d.type == "l") {
        output.push({ x1: last.x, y1: last.y, x2: last.x + d.x, y2: last.y + d.y });
        last = { x: last.x + d.x, y: last.y + d.y };
    } else if (d.type == "L") {
        output.push({ x1: last.x, y1: last.y, x2: d.x, y2: d.y });
        last = { x: d.x, y: d.y };
    } else if (d.type == "H") {
        output.push({ x1: last.x, y1: last.y, x2: d.x, y2: last.y });
        last = { x: d.x, y: last.y };
    } else if (d.type == "V") {
        output.push({ x1: last.x, y1: last.y, x2: last.x, y2: d.y });
        last = { x: last.x, y: d.y };
    } else if (d.type == "z") {
    } else console.log("Unknown type ", d.type);
}
console.log(JSON.stringify(output));
