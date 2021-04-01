import { Wall, Interactable, TaskInteractable, GameMap } from "./map.js"
import { Point } from "../point.js";
import { UploadTaskModal } from "./upload_task_modal.js";
import { SwipeCardTaskModal } from "./swipe_card_task_modal.js";
import { FixWireTaskModal } from "./fix_wire_task_modal.js";
import { RefuelStationTaskModal } from "./refuel_station_task_modal.js";
import { RefuelEngineTaskModal } from "./refuel_engine_task_modal.js";
import { EmergencyModal } from "./emergency_modal.js";
import { Images } from "../resources.js";
import {MapLocation} from "../game_task.js";
type p5 = any;

export class MainMap implements GameMap {
    walkWalls = [
        new Wall(new Point(1942.5, 95), new Point(1742.5, 95)),
        new Wall(new Point(1742.5, 95), new Point(1742.5, 260)),
        new Wall(new Point(1742.5, 260), new Point(1427.5, 260)),
        new Wall(new Point(1427.5, 260), new Point(1427.5, 105)),
        new Wall(new Point(1427.5, 105), new Point(1177.5, 105)),
        new Wall(new Point(1177.5, 105), new Point(1177.5, -260)),
        new Wall(new Point(1177.5, -260), new Point(1212.5, -355)),
        new Wall(new Point(1212.5, -355), new Point(1322.5, -355)),
        new Wall(new Point(1322.5, -355), new Point(1097.5, -580)),
        new Wall(new Point(1097.5, -580), new Point(977.5, -580)),
        new Wall(new Point(977.5, -580), new Point(977.5, -480)),
        new Wall(new Point(977.5, -480), new Point(917.5, -360)),
        new Wall(new Point(917.5, -360), new Point(612.5, -360)),
        new Wall(new Point(612.5, -360), new Point(612.5, -520)),
        new Wall(new Point(612.5, -520), new Point(317.5, -825)),
        new Wall(new Point(317.5, -825), new Point(-347.5, -825)),
        new Wall(new Point(-347.5, -825), new Point(-552.5, -625)),
        new Wall(new Point(-552.5, -625), new Point(-552.5, -355)),
        new Wall(new Point(-552.5, -355), new Point(-1457.5, -355)),
        new Wall(new Point(-1457.5, -355), new Point(-1457.5, -495)),
        new Wall(new Point(-1457.5, -495), new Point(-1827.5, -495)),
        new Wall(new Point(-1827.5, -495), new Point(-1952.5, -395)),
        new Wall(new Point(-1952.5, -395), new Point(-1562.5, -395)),
        new Wall(new Point(-1562.5, -395), new Point(-1562.5, -165)),
        new Wall(new Point(-1562.5, -165), new Point(-1807.5, -165)),
        new Wall(new Point(-1807.5, -165), new Point(-1857.5, -115)),
        new Wall(new Point(-1857.5, -115), new Point(-1952.5, -115)),
        new Wall(new Point(-1952.5, -115), new Point(-1952.5, -30)),
        new Wall(new Point(-1952.5, -30), new Point(-1742.5, -30)),
        new Wall(new Point(-1742.5, -30), new Point(-1742.5, 325)),
        new Wall(new Point(-1742.5, 325), new Point(-1917.5, 325)),
        new Wall(new Point(-1917.5, 325), new Point(-1917.5, 160)),
        new Wall(new Point(-1917.5, 160), new Point(-2082.5, 160)),
        new Wall(new Point(-2082.5, 160), new Point(-2082.5, -20)),
        new Wall(new Point(-2082.5, -20), new Point(-2182.5, -20)),
        new Wall(new Point(-2182.5, -20), new Point(-2312.5, 95)),
        new Wall(new Point(-2312.5, 95), new Point(-2312.5, 195)),
        new Wall(new Point(-2312.5, 195), new Point(-2162.5, 365)),
        new Wall(new Point(-2162.5, 365), new Point(-2162.5, 405)),
        new Wall(new Point(-2162.5, 405), new Point(-2312.5, 545)),
        new Wall(new Point(-2312.5, 545), new Point(-2312.5, 670)),
        new Wall(new Point(-2312.5, 670), new Point(-2182.5, 750)),
        new Wall(new Point(-2182.5, 750), new Point(-2082.5, 750)),
        new Wall(new Point(-2082.5, 750), new Point(-2082.5, 570)),
        new Wall(new Point(-2082.5, 570), new Point(-1917.5, 570)),
        new Wall(new Point(-1917.5, 570), new Point(-1917.5, 445)),
        new Wall(new Point(-1917.5, 445), new Point(-1742.5, 445)),
        new Wall(new Point(-1742.5, 445), new Point(-1742.5, 800)),
        new Wall(new Point(-1742.5, 800), new Point(-1952.5, 800)),
        new Wall(new Point(-1952.5, 800), new Point(-1952.5, 890)),
        new Wall(new Point(-1952.5, 890), new Point(-1557.5, 890)),
        new Wall(new Point(-1557.5, 890), new Point(-1557.5, 1120)),
        new Wall(new Point(-1557.5, 1120), new Point(-1812.5, 1120)),
        new Wall(new Point(-1812.5, 1120), new Point(-1852.5, 1170)),
        new Wall(new Point(-1852.5, 1170), new Point(-1942.5, 1170)),
        new Wall(new Point(-1942.5, 1170), new Point(-1827.5, 1265)),
        new Wall(new Point(-1827.5, 1265), new Point(-1457.5, 1265)),
        new Wall(new Point(-1457.5, 1265), new Point(-1457.5, 1095)),
        new Wall(new Point(-1457.5, 1095), new Point(-1237.5, 1095)),
        new Wall(new Point(-1237.5, 1095), new Point(-1237.5, 1390)),
        new Wall(new Point(-1237.5, 1390), new Point(-437.5, 1390)),
        new Wall(new Point(-437.5, 1390), new Point(-437.5, 1430)),
        new Wall(new Point(-437.5, 1430), new Point(-222.5, 1640)),
        new Wall(new Point(-222.5, 1640), new Point(192.5, 1640)),
        new Wall(new Point(192.5, 1640), new Point(192.5, 1155)),
        new Wall(new Point(192.5, 1155), new Point(557.5, 1155)),
        new Wall(new Point(557.5, 1155), new Point(557.5, 1320)),
        new Wall(new Point(557.5, 1320), new Point(257.5, 1320)),
        new Wall(new Point(257.5, 1320), new Point(257.5, 1535)),
        new Wall(new Point(257.5, 1535), new Point(362.5, 1640)),
        new Wall(new Point(362.5, 1640), new Point(677.5, 1640)),
        new Wall(new Point(677.5, 1640), new Point(782.5, 1535)),
        new Wall(new Point(782.5, 1535), new Point(782.5, 1315)),
        new Wall(new Point(782.5, 1315), new Point(712.5, 1315)),
        new Wall(new Point(712.5, 1315), new Point(712.5, 1155)),
        new Wall(new Point(712.5, 1155), new Point(922.5, 1155)),
        new Wall(new Point(922.5, 1155), new Point(1022.5, 1260)),
        new Wall(new Point(1022.5, 1260), new Point(1022.5, 1295)),
        new Wall(new Point(1022.5, 1295), new Point(872.5, 1295)),
        new Wall(new Point(872.5, 1295), new Point(872.5, 1345)),
        new Wall(new Point(872.5, 1345), new Point(1012.5, 1350)),
        new Wall(new Point(1012.5, 1350), new Point(1012.5, 1370)),
        new Wall(new Point(1012.5, 1370), new Point(1102.5, 1370)),
        new Wall(new Point(1102.5, 1370), new Point(1167.5, 1305)),
        new Wall(new Point(1167.5, 1305), new Point(1167.5, 1225)),
        new Wall(new Point(1167.5, 1225), new Point(1212.5, 1175)),
        new Wall(new Point(1212.5, 1175), new Point(1212.5, 1085)),
        new Wall(new Point(1212.5, 1085), new Point(1167.5, 1025)),
        new Wall(new Point(1167.5, 1025), new Point(1167.5, 940)),
        new Wall(new Point(1167.5, 940), new Point(1322.5, 940)),
        new Wall(new Point(1322.5, 940), new Point(1322.5, 900)),
        new Wall(new Point(1322.5, 900), new Point(1162.5, 900)),
        new Wall(new Point(1162.5, 900), new Point(1162.5, 545)),
        new Wall(new Point(1162.5, 545), new Point(1427.5, 545)),
        new Wall(new Point(1427.5, 545), new Point(1427.5, 370)),
        new Wall(new Point(1427.5, 370), new Point(1742.5, 370)),
        new Wall(new Point(1742.5, 370), new Point(1742.5, 510)),
        new Wall(new Point(1742.5, 510), new Point(1942.5, 510)),
        new Wall(new Point(1942.5, 510), new Point(2112.5, 375)),
        new Wall(new Point(2112.5, 375), new Point(2112.5, 220)),
        new Wall(new Point(2112.5, 220), new Point(1942.5, 95)),
        new Wall(new Point(-277.5, 760), new Point(-442.5, 895)),
        new Wall(new Point(-442.5, 895), new Point(-442.5, 1285)),
        new Wall(new Point(-442.5, 1285), new Point(-837.5, 1285)),
        new Wall(new Point(-837.5, 1285), new Point(-837.5, 1105)),
        new Wall(new Point(-837.5, 1105), new Point(-682.5, 1105)),
        new Wall(new Point(-682.5, 1105), new Point(-577.5, 1000)),
        new Wall(new Point(-577.5, 1000), new Point(-577.5, 790)),
        new Wall(new Point(-577.5, 790), new Point(-457.5, 670)),
        new Wall(new Point(-457.5, 670), new Point(-457.5, 650)),
        new Wall(new Point(-457.5, 650), new Point(-822.5, 650)),
        new Wall(new Point(-822.5, 650), new Point(-822.5, 620)),
        new Wall(new Point(-822.5, 620), new Point(-962.5, 620)),
        new Wall(new Point(-962.5, 620), new Point(-962.5, 790)),
        new Wall(new Point(-962.5, 790), new Point(-702.5, 790)),
        new Wall(new Point(-702.5, 790), new Point(-702.5, 895)),
        new Wall(new Point(-702.5, 895), new Point(-967.5, 895)),
        new Wall(new Point(-967.5, 895), new Point(-967.5, 1285)),
        new Wall(new Point(-967.5, 1285), new Point(-1107.5, 1285)),
        new Wall(new Point(-1107.5, 1285), new Point(-1107.5, 985)),
        new Wall(new Point(-1107.5, 985), new Point(-1457.5, 985)),
        new Wall(new Point(-1457.5, 985), new Point(-1457.5, 800)),
        new Wall(new Point(-1457.5, 800), new Point(-1607.5, 800)),
        new Wall(new Point(-1607.5, 800), new Point(-1607.5, 445)),
        new Wall(new Point(-1607.5, 445), new Point(-1427.5, 445)),
        new Wall(new Point(-1427.5, 445), new Point(-1427.5, 575)),
        new Wall(new Point(-1427.5, 575), new Point(-1147.5, 575)),
        new Wall(new Point(-1147.5, 575), new Point(-1147.5, 165)),
        new Wall(new Point(-1147.5, 165), new Point(-1232.5, 85)),
        new Wall(new Point(-1232.5, 85), new Point(-1322.5, 85)),
        new Wall(new Point(-1322.5, 85), new Point(-1427.5, 190)),
        new Wall(new Point(-1427.5, 190), new Point(-1427.5, 325)),
        new Wall(new Point(-1427.5, 325), new Point(-1607.5, 325)),
        new Wall(new Point(-1607.5, 325), new Point(-1607.5, -30)),
        new Wall(new Point(-1607.5, -30), new Point(-1457.5, -30)),
        new Wall(new Point(-1457.5, -30), new Point(-1457.5, -235)),
        new Wall(new Point(-1457.5, -235), new Point(-952.5, -235)),
        new Wall(new Point(-952.5, -235), new Point(-952.5, -125)),
        new Wall(new Point(-952.5, -125), new Point(-1077.5, -125)),
        new Wall(new Point(-1077.5, -125), new Point(-1077.5, 310)),
        new Wall(new Point(-1077.5, 310), new Point(-992.5, 415)),
        new Wall(new Point(-992.5, 415), new Point(-437.5, 415)),
        new Wall(new Point(-437.5, 415), new Point(-437.5, 280)),
        new Wall(new Point(-437.5, 280), new Point(-627.5, 95)),
        new Wall(new Point(-627.5, 95), new Point(-627.5, -125)),
        new Wall(new Point(-627.5, -125), new Point(-777.5, -125)),
        new Wall(new Point(-777.5, -125), new Point(-777.5, -235)),
        new Wall(new Point(-777.5, -235), new Point(-552.5, -235)),
        new Wall(new Point(-552.5, -235), new Point(-552.5, 15)),
        new Wall(new Point(-552.5, 15), new Point(-297.5, 275)),
        new Wall(new Point(-297.5, 275), new Point(-42.5, 275)),
        new Wall(new Point(-42.5, 275), new Point(-42.5, 760)),
        new Wall(new Point(-42.5, 760), new Point(-277.5, 760)),
        new Wall(new Point(1287.5, 445), new Point(1027.5, 445)),
        new Wall(new Point(1027.5, 445), new Point(1027.5, 975)),
        new Wall(new Point(1027.5, 975), new Point(952.5, 1045)),
        new Wall(new Point(952.5, 1045), new Point(192.5, 1045)),
        new Wall(new Point(192.5, 1045), new Point(192.5, 755)),
        new Wall(new Point(192.5, 755), new Point(92.5, 755)),
        new Wall(new Point(92.5, 755), new Point(92.5, 610)),
        new Wall(new Point(92.5, 610), new Point(307.5, 610)),
        new Wall(new Point(307.5, 610), new Point(307.5, 885)),
        new Wall(new Point(307.5, 885), new Point(742.5, 885)),
        new Wall(new Point(742.5, 885), new Point(827.5, 795)),
        new Wall(new Point(827.5, 795), new Point(827.5, 505)),
        new Wall(new Point(827.5, 505), new Point(92.5, 505)),
        new Wall(new Point(92.5, 505), new Point(92.5, 275)),
        new Wall(new Point(92.5, 275), new Point(352.5, 275)),
        new Wall(new Point(352.5, 275), new Point(612.5, 0)),
        new Wall(new Point(612.5, 0), new Point(612.5, -245)),
        new Wall(new Point(612.5, -245), new Point(847.5, -245)),
        new Wall(new Point(847.5, -245), new Point(847.5, -235)),
        new Wall(new Point(847.5, -235), new Point(977.5, -235)),
        new Wall(new Point(977.5, -235), new Point(1017.5, -210)),
        new Wall(new Point(1017.5, -210), new Point(1017.5, 115)),
        new Wall(new Point(1017.5, 115), new Point(732.5, 115)),
        new Wall(new Point(732.5, 115), new Point(687.5, 160)),
        new Wall(new Point(687.5, 160), new Point(642.5, 160)),
        new Wall(new Point(642.5, 160), new Point(537.5, 280)),
        new Wall(new Point(537.5, 280), new Point(912.5, 280)),
        new Wall(new Point(912.5, 280), new Point(912.5, 230)),
        new Wall(new Point(912.5, 230), new Point(1287.5, 230)),
        new Wall(new Point(1287.5, 230), new Point(1287.5, 445)),
        new Wall(new Point(-250, 1220), new Point(-250, 978)),
        new Wall(new Point(-250, 978), new Point(48.5, 978)),
        new Wall(new Point(48.7, 978), new Point(48.5, 1170)),
        new Wall(new Point(48.7, 1170), new Point(-115.5, 1342.5)),
        new Wall(new Point(-115.5, 1342.5), new Point(-250, 1220)),

        // Desk in Admin
        new Wall(new Point(452.5, 653.5), new Point(647.5, 653.5), [0, 0, 0, 0]),
        new Wall(new Point(647.5, 653.5), new Point(647.5, 770.5), [0, 0, 0, 0]),
        new Wall(new Point(647.5, 770.5), new Point(452.5, 770.5), [0, 0, 0, 0]),
        new Wall(new Point(452.5, 770.5), new Point(452.5, 653.5), [0, 0, 0, 0]),
    ];

    lightWalls = [
        new Wall(new Point(1942.5, -55), new Point(1742.5, -55)),
        new Wall(new Point(1742.5, -55), new Point(1742.5, 110)),
        new Wall(new Point(1742.5, 110), new Point(1427.5, 110)),
        new Wall(new Point(1427.5, 110), new Point(1427.5, -45)),
        new Wall(new Point(1427.5, -45), new Point(1177.5, -45)),
        new Wall(new Point(1177.5, -45), new Point(1177.5, -120)),
        new Wall(new Point(1177.5, -120), new Point(1322.5, -120)),
        new Wall(new Point(1322.5, -120), new Point(1322.5, -505)),
        new Wall(new Point(1322.5, -505), new Point(1097.5, -730)),
        new Wall(new Point(1097.5, -730), new Point(847.5, -730)),
        new Wall(new Point(847.5, -730), new Point(847.5, -510)),
        new Wall(new Point(847.5, -510), new Point(612.5, -510)),
        new Wall(new Point(612.5, -510), new Point(612.5, -670)),
        new Wall(new Point(612.5, -670), new Point(317.5, -975)),
        new Wall(new Point(317.5, -975), new Point(-347.5, -975)),
        new Wall(new Point(-347.5, -975), new Point(-552.5, -775)),
        new Wall(new Point(-552.5, -775), new Point(-552.5, -505)),
        new Wall(new Point(-552.5, -505), new Point(-1457.5, -505)),
        new Wall(new Point(-1457.5, -505), new Point(-1457.5, -645)),
        new Wall(new Point(-1457.5, -645), new Point(-1827.5, -645)),
        new Wall(new Point(-1827.5, -645), new Point(-1952.5, -545)),
        new Wall(new Point(-1952.5, -545), new Point(-1952.5, -395)),
        new Wall(new Point(-1952.5, -395), new Point(-1562.5, -395)),
        new Wall(new Point(-1562.5, -395), new Point(-1562.5, -315)),
        new Wall(new Point(-1562.5, -315), new Point(-1807.5, -315)),
        new Wall(new Point(-1807.5, -315), new Point(-1857.5, -265)),
        new Wall(new Point(-1857.5, -265), new Point(-1952.5, -265)),
        new Wall(new Point(-1952.5, -265), new Point(-1952.5, -30)),
        new Wall(new Point(-1952.5, -30), new Point(-1742.5, -30)),
        new Wall(new Point(-1742.5, -30), new Point(-1742.5, 175)),
        new Wall(new Point(-1742.5, 175), new Point(-1917.5, 175)),
        new Wall(new Point(-1917.5, 175), new Point(-1917.5, 10)),
        new Wall(new Point(-1917.5, 10), new Point(-2082.5, 10)),
        new Wall(new Point(-2082.5, 10), new Point(-2082.5, -170)),
        new Wall(new Point(-2082.5, -170), new Point(-2182.5, -170)),
        new Wall(new Point(-2182.5, -170), new Point(-2312.5, -55)),
        new Wall(new Point(-2312.5, -55), new Point(-2312.5, 545)),
        new Wall(new Point(-2312.5, 545), new Point(-2312.5, 670)),
        new Wall(new Point(-2312.5, 670), new Point(-2182.5, 750)),
        new Wall(new Point(-2182.5, 750), new Point(-2082.5, 750)),
        new Wall(new Point(-2082.5, 750), new Point(-2082.5, 570)),
        new Wall(new Point(-2082.5, 570), new Point(-1917.5, 570)),
        new Wall(new Point(-1917.5, 570), new Point(-1917.5, 445)),
        new Wall(new Point(-1917.5, 445), new Point(-1742.5, 445)),
        new Wall(new Point(-1742.5, 445), new Point(-1742.5, 650)),
        new Wall(new Point(-1742.5, 650), new Point(-1952.5, 650)),
        new Wall(new Point(-1952.5, 650), new Point(-1952.5, 890)),
        new Wall(new Point(-1952.5, 890), new Point(-1557.5, 890)),
        new Wall(new Point(-1557.5, 890), new Point(-1557.5, 970)),
        new Wall(new Point(-1557.5, 970), new Point(-1812.5, 970)),
        new Wall(new Point(-1812.5, 970), new Point(-1852.5, 1020)),
        new Wall(new Point(-1852.5, 1020), new Point(-1942.5, 1020)),
        new Wall(new Point(-1942.5, 1020), new Point(-1942.5, 1170)),
        new Wall(new Point(-1942.5, 1170), new Point(-1827.5, 1265)),
        new Wall(new Point(-1827.5, 1265), new Point(-1457.5, 1265)),
        new Wall(new Point(-1457.5, 1265), new Point(-1457.5, 1095)),
        new Wall(new Point(-1457.5, 1095), new Point(-1237.5, 1095)),
        new Wall(new Point(-1237.5, 1095), new Point(-1237.5, 1390)),
        new Wall(new Point(-1237.5, 1390), new Point(-437.5, 1390)),
        new Wall(new Point(-437.5, 1390), new Point(-437.5, 1430)),
        new Wall(new Point(-437.5, 1430), new Point(-222.5, 1640)),
        new Wall(new Point(-222.5, 1640), new Point(192.5, 1640)),
        new Wall(new Point(192.5, 1640), new Point(192.5, 1155)),
        new Wall(new Point(192.5, 1155), new Point(557.5, 1155)),
        new Wall(new Point(557.5, 1155), new Point(557.5, 1220)),
        new Wall(new Point(557.5, 1220), new Point(257.5, 1220)),
        new Wall(new Point(257.5, 1220), new Point(257.5, 1535)),
        new Wall(new Point(257.5, 1535), new Point(362.5, 1640)),
        new Wall(new Point(362.5, 1640), new Point(677.5, 1640)),
        new Wall(new Point(677.5, 1640), new Point(782.5, 1535)),
        new Wall(new Point(782.5, 1535), new Point(782.5, 1220)),
        new Wall(new Point(782.5, 1220), new Point(712.5, 1220)),
        new Wall(new Point(712.5, 1220), new Point(712.5, 1155)),
        new Wall(new Point(712.5, 1155), new Point(872.5, 1155)),
        new Wall(new Point(872.5, 1155), new Point(872.5, 1370)),
        new Wall(new Point(872.5, 1370), new Point(1102.5, 1370)),
        new Wall(new Point(1102.5, 1370), new Point(1322.5, 1150)),
        new Wall(new Point(1322.5, 1150), new Point(1322.5, 750)),
        new Wall(new Point(1322.5, 750), new Point(1162.5, 750)),
        new Wall(new Point(1162.5, 750), new Point(1162.5, 545)),
        new Wall(new Point(1162.5, 545), new Point(1427.5, 545)),
        new Wall(new Point(1427.5, 545), new Point(1427.5, 370)),
        new Wall(new Point(1427.5, 370), new Point(1742.5, 370)),
        new Wall(new Point(1742.5, 370), new Point(1742.5, 510)),
        new Wall(new Point(1742.5, 510), new Point(1942.5, 510)),
        new Wall(new Point(1942.5, 510), new Point(2112.5, 375)),
        new Wall(new Point(2112.5, 375), new Point(2112.5, 70)),
        new Wall(new Point(2112.5, 70), new Point(1942.5, -55)),
        new Wall(new Point(-277.5, 660), new Point(-442.5, 795)),
        new Wall(new Point(-442.5, 795), new Point(-442.5, 1135)),
        new Wall(new Point(-442.5, 1135), new Point(-837.5, 1135)),
        new Wall(new Point(-837.5, 1135), new Point(-837.5, 1105)),
        new Wall(new Point(-837.5, 1105), new Point(-682.5, 1105)),
        new Wall(new Point(-682.5, 1105), new Point(-577.5, 1000)),
        new Wall(new Point(-577.5, 1000), new Point(-577.5, 790)),
        new Wall(new Point(-577.5, 790), new Point(-457.5, 670)),
        new Wall(new Point(-457.5, 670), new Point(-457.5, 520)),
        new Wall(new Point(-457.5, 520), new Point(-962.5, 520)),
        new Wall(new Point(-962.5, 520), new Point(-962.5, 1135)),
        new Wall(new Point(-962.5, 790), new Point(-702.5, 790)),
        new Wall(new Point(-962.5, 1135), new Point(-1107.5, 1135)),
        new Wall(new Point(-1107.5, 1135), new Point(-1107.5, 835)),
        new Wall(new Point(-1107.5, 835), new Point(-1457.5, 835)),
        new Wall(new Point(-1457.5, 835), new Point(-1457.5, 650)),
        new Wall(new Point(-1457.5, 650), new Point(-1607.5, 650)),
        new Wall(new Point(-1607.5, 650), new Point(-1607.5, 445)),
        new Wall(new Point(-1607.5, 445), new Point(-1427.5, 445)),
        new Wall(new Point(-1427.5, 445), new Point(-1427.5, 575)),
        new Wall(new Point(-1427.5, 575), new Point(-1147.5, 575)),
        new Wall(new Point(-1147.5, 575), new Point(-1147.5, 15)),
        new Wall(new Point(-1147.5, 15), new Point(-1232.5, -65)),
        new Wall(new Point(-1232.5, -65), new Point(-1322.5, -65)),
        new Wall(new Point(-1322.5, -65), new Point(-1427.5, 40)),
        new Wall(new Point(-1427.5, 40), new Point(-1427.5, 175)),
        new Wall(new Point(-1427.5, 175), new Point(-1607.5, 175)),
        new Wall(new Point(-1607.5, 175), new Point(-1607.5, -30)),
        new Wall(new Point(-1607.5, -30), new Point(-1457.5, -30)),
        new Wall(new Point(-1457.5, -30), new Point(-1457.5, -235)),
        new Wall(new Point(-1457.5, -235), new Point(-952.5, -235)),
        new Wall(new Point(-952.5, -235), new Point(-952.5, -225)),
        new Wall(new Point(-952.5, -225), new Point(-1077.5, -225)),
        new Wall(new Point(-1077.5, -225), new Point(-1077.5, 310)),
        new Wall(new Point(-1077.5, 310), new Point(-992.5, 415)),
        new Wall(new Point(-992.5, 415), new Point(-437.5, 415)),
        new Wall(new Point(-437.5, 415), new Point(-437.5, 280)),
        new Wall(new Point(-437.5, 280), new Point(-627.5, 95)),
        new Wall(new Point(-627.5, 95), new Point(-627.5, -225)),
        new Wall(new Point(-627.5, -225), new Point(-777.5, -225)),
        new Wall(new Point(-777.5, -225), new Point(-777.5, -235)),
        new Wall(new Point(-777.5, -235), new Point(-552.5, -235)),
        new Wall(new Point(-552.5, -235), new Point(-552.5, 15)),
        new Wall(new Point(-552.5, 15), new Point(-297.5, 275)),
        new Wall(new Point(-297.5, 275), new Point(-42.5, 275)),
        new Wall(new Point(-42.5, 275), new Point(-42.5, 660)),
        new Wall(new Point(-42.5, 660), new Point(-277.5, 660)),
        new Wall(new Point(1287.5, 295), new Point(1027.5, 295)),
        new Wall(new Point(1027.5, 295), new Point(1027.5, 750)),
        new Wall(new Point(1027.5, 750), new Point(872.5, 905)),
        new Wall(new Point(872.5, 905), new Point(872.5, 945)),
        new Wall(new Point(872.5, 945), new Point(192.5, 945)),
        new Wall(new Point(192.5, 945), new Point(192.5, 660)),
        new Wall(new Point(192.5, 660), new Point(92.5, 660)),
        new Wall(new Point(92.5, 660), new Point(92.5, 610)),
        new Wall(new Point(92.5, 610), new Point(307.5, 610)),
        new Wall(new Point(307.5, 610), new Point(307.5, 885)),
        new Wall(new Point(307.5, 885), new Point(742.5, 885)),
        new Wall(new Point(742.5, 885), new Point(827.5, 795)),
        new Wall(new Point(827.5, 795), new Point(827.5, 355)),
        new Wall(new Point(827.5, 355), new Point(92.5, 355)),
        new Wall(new Point(92.5, 355), new Point(92.5, 275)),
        new Wall(new Point(92.5, 275), new Point(352.5, 275)),
        new Wall(new Point(352.5, 275), new Point(612.5, 0)),
        new Wall(new Point(612.5, 0), new Point(612.5, -245)),
        new Wall(new Point(612.5, -245), new Point(847.5, -245)),
        new Wall(new Point(847.5, -245), new Point(847.5, -185)),
        new Wall(new Point(847.5, -185), new Point(912.5, -120)),
        new Wall(new Point(912.5, -120), new Point(1017.5, -120)),
        new Wall(new Point(1017.5, -120), new Point(1017.5, -35)),
        new Wall(new Point(1017.5, -35), new Point(912.5, -35)),
        new Wall(new Point(912.5, -35), new Point(912.5, -85)),
        new Wall(new Point(912.5, -85), new Point(732.5, -85)),
        new Wall(new Point(732.5, -85), new Point(732.5, -35)),
        new Wall(new Point(732.5, -35), new Point(537.5, 160)),
        new Wall(new Point(537.5, 160), new Point(537.5, 280)),
        new Wall(new Point(537.5, 280), new Point(912.5, 280)),
        new Wall(new Point(912.5, 280), new Point(912.5, 230)),
        new Wall(new Point(912.5, 230), new Point(1287.5, 230)),
        new Wall(new Point(1287.5, 230), new Point(1287.5, 295)),
        new Wall(new Point(-250, 1070), new Point(-250, 978)),
        new Wall(new Point(-250, 978), new Point(48.5, 978)),
        new Wall(new Point(48.7, 978), new Point(48.5, 1020)),
        new Wall(new Point(48.7, 1020), new Point(-115.5, 1192.5)),
        new Wall(new Point(-115.5, 1192.5), new Point(-250, 1070)),
    ];

    interactables = [
        // Emergency Meeting
        new Interactable(
            "use",
            (scene) => new Point(23, -290).subtract(scene.players[scene.username].pos).norm() < 250,
            (sketch: p5) => {
                sketch.stroke(0);
                sketch.strokeWeight(3);
                sketch.fill(46, 71, 112);
                sketch.ellipse(23, -290, 300);
                sketch.fill(172, 47, 39);
                sketch.ellipse(23, -290, 50);
            },
            (scene) => new EmergencyModal(scene.username, scene.noRemainEmergency),
        ),

        ...[
            { pos: new Point(486, 1270), loc: MapLocation.Communications },
            { pos: new Point(1896, 50), loc: MapLocation.Navigation },
            { pos: new Point(1029, -625), loc: MapLocation.Weapons },
        ].map((info) => new TaskInteractable(
            info.pos,
            "upload_data",
            info.loc,
            (sketch: p5) => sketch.image(Images["upload_data"], info.pos.x - 70/2, info.pos.y - 45/2, 70, 45),
            (sketch: p5) => sketch.rect(info.pos.x - 70/2, info.pos.y - 45/2, 70, 45),
            (onClose) => new UploadTaskModal("Download", info.loc, "My Tablet", onClose),
        )),

        new TaskInteractable(
            new Point(440.5, -761.5),
            "upload_data",
            MapLocation.Cafeteria,
            (sketch: p5) => sketch.image(Images["upload_data_skewed"], 403.5, -825.5, 44, 95),
            (sketch: p5) => {
                sketch.beginShape();
                sketch.vertex(403.5, -775.5);
                sketch.vertex(447.5, -730.5);
                sketch.vertex(447.5, -780.5);
                sketch.vertex(403.5, -825.5);
                sketch.endShape(sketch.CLOSE);
            },
            (onClose) => new UploadTaskModal("Download", "Cafeteria", "My Tablet", onClose),
        ),

        new TaskInteractable(
            new Point(385.5, 455.5),
            "upload_data",
            MapLocation.Admin,
            (sketch: p5) => sketch.image(Images["upload_data"], 340.5, 433, 70, 45),
            (sketch: p5) => sketch.rect(340.5, 433, 70, 45),
            (onClose) => new UploadTaskModal("Upload", "My Tablet", "Headquarters", onClose),
        ),

        new TaskInteractable(
            new Point(637.5, 712),
            "swipe_card",
            MapLocation.Admin,
            (sketch: p5) => sketch.image(Images["swipe_card"], 625.5, 665.5, 32, 90),
            (sketch: p5) => sketch.rect(625.5, 665.5, 23, 90),
            (onClose) => new SwipeCardTaskModal(onClose),
        ),

        ...[
            { pos: new Point(-125, 707.5), loc: MapLocation.Storage },
            { pos: new Point(-735, 600), loc: MapLocation.Electrical },
            { pos: new Point(-1522, 275), loc: MapLocation.Security },
            { pos: new Point(1673, 210), loc: MapLocation.Navigation },
            { pos: new Point(228, 455.5), loc: MapLocation.Admin },
        ].map((info) => new TaskInteractable(
            info.pos,
            "fix_wiring",
            info.loc,
            (sketch: p5) => sketch.image(Images["fix_wiring"], info.pos.x - 35, info.pos.y - 22.5, 70, 45),
            (sketch: p5) => sketch.rect(info.pos.x - 35, info.pos.y - 22.5, 70, 45),
            (onClose) => new FixWireTaskModal(onClose),
        )),

        new TaskInteractable(
            new Point(-468, -778),
            "fix_wiring",
            MapLocation.Cafeteria,
            (sketch: p5) => sketch.image(Images["fix_wiring_skewed"], -490, -825.5, 44, 95),
            (sketch: p5) => {
                sketch.beginShape();
                sketch.vertex(-446, -825);
                sketch.vertex(-446, -775);
                sketch.vertex(-490, -730);
                sketch.vertex(-490, -780);
                sketch.endShape(sketch.CLOSE);
            },
            (onClose) => new FixWireTaskModal(onClose),
        ),

        new TaskInteractable(
            new Point(-187.5, 1280),
            "refuel_engines",
            MapLocation.Storage,
            (sketch: p5) => sketch.image(Images["refuel_station"], -214.5, 1242, 55, 76),
            (sketch: p5) => sketch.rect(-214.5, 1242, 55, 76),
            (onClose) => new RefuelStationTaskModal(onClose),
        ),

        ...[
            { pos: new Point(-1835, 1109.5), loc: MapLocation.LowerEngine },
            { pos: new Point(-1835, -170.5), loc: MapLocation.UpperEngine },
        ].map((info) => new TaskInteractable(
            info.pos,
            "refuel_engines",
            info.loc,
            (sketch: p5) => sketch.image(Images["engine_oil"], info.pos.x - 30, info.pos.y - 49, 60, 98),
            (sketch: p5) => sketch.rect(info.pos.x - 30, info.pos.y - 49, 60, 98),
            (onClose) => new RefuelStationTaskModal(onClose),
        )),

        ...[
            { pos: new Point(0, 0), loc: MapLocation.LowerEngine },
            { pos: new Point(0, 0), loc: MapLocation.UpperEngine },
        ].map(({pos, loc}) => new TaskInteractable(
            pos,
            "align_engine",
            loc,
            (sketch: p5) => sketch.image(Images["align_engine"], pos.x
        )),
    ];

    preRender(sketch: p5) {
        sketch.background(64, 74, 74);

        // Cafetaria
        sketch.noStroke();
        sketch.fill(173, 177, 162);
        sketch.beginShape();
        sketch.vertex(612.5, -520);
        sketch.vertex(317.5, -825);
        sketch.vertex(-347.5, -825);
        sketch.vertex(-552.5, -625);
        sketch.vertex(-552.5, 15);
        sketch.vertex(-297.5, 275);
        sketch.vertex(352.5, 275);
        sketch.vertex(612.5, 0);
        sketch.vertex(612.5, -245);
        sketch.vertex(92.5, 270);
        sketch.vertex(352.5, 270);
        sketch.vertex(612.5, 0);
        sketch.endShape(sketch.CLOSE);

        // Cafe-Engine-Med T-shaped Road
        sketch.fill(133, 155, 161);
        sketch.beginShape();
        sketch.vertex(-1457.5, -355);
        sketch.vertex(-552.5, -355);
        sketch.vertex(-552.5, -235);
        sketch.vertex(-777.5, -235);
        sketch.vertex(-777.5, -125);
        sketch.vertex(-952.5, -125);
        sketch.vertex(-952.5, -235);
        sketch.vertex(-1457.5, -235);
        sketch.endShape(sketch.CLOSE);

        sketch.stroke(117, 139, 148);
        sketch.strokeWeight(1);
        for (let x = -1457.5; x < -552.5-20; x += 10) {
            sketch.line(x, -335, x, -255);
        }
        for (let y = -235; y < -125; y += 10) {
            sketch.line(-932.5, y, -797.5, y);
        }

        sketch.fill(48, 62, 68)
        sketch.stroke(40, 54, 54);
        sketch.strokeWeight(5);
        sketch.rect(-552.5-20, -355, 20, 120);
        sketch.rect(-741.6, -355, 20, 120);
        sketch.rect(-980.2, -355, 20, 120);
        sketch.rect(-1218.9, -355, 20, 120);
        sketch.rect(-1457.5, -355, 20, 120);

        // Med
        sketch.fill(133, 151, 156);
        sketch.noStroke();
        sketch.beginShape();
        sketch.vertex(-1077.5, -125);
        sketch.vertex(-1077.5, 310);
        sketch.vertex(-992.5, 415);
        sketch.vertex(-437.5, 415);
        sketch.vertex(-437.5, 280);
        sketch.vertex(-627.5, 95);
        sketch.vertex(-627.5, 95);
        sketch.vertex(-627.5, -125);
        sketch.endShape(sketch.CLOSE);
        for (let i=0; i < 2; i++) {
            if (i == 0) {
                sketch.strokeWeight(5);
                sketch.stroke(101, 115, 118);
            } else {
                sketch.strokeWeight(2);
                sketch.stroke(118, 133, 138);
                sketch.line(-952.5, -125, -777.5, -125);
            }
            // Horizontal lines
            sketch.line(-952.5, -100, -777.5, -100);
            sketch.line(-952.5, 30, -777.5, 30);
            sketch.line(-952.5, 105, -777.5, 105);
            sketch.line(-952.5, 225, -777.5, 225);
            sketch.line(-952.5, 345, -777.5, 345);
            // Vertical Lines
            sketch.line(-835.8, -125, -835.8, -100);
            sketch.line(-894.2, -100, -894.2, 30);
            sketch.line(-835.8, 30, -835.8, 105);
            sketch.line(-894.2, 105, -894.2, 225);
            sketch.line(-835.8, 225, -835.8, 345);
            sketch.line(-894.2, 345, -894.2, 415);
        }
        for (let i = 0; i < 2; i++) {
            if (i == 0) {
                sketch.stroke(68, 81, 84);
                sketch.strokeWeight(10);
            } else {
                sketch.stroke(94, 107, 111);
                sketch.strokeWeight(5);
            }
            sketch.line(-952.5, -125, -952.5, 415);
            sketch.line(-777.5, -125, -777.5, 415);
            sketch.line(-627.5, 95, -627.5, 415);
            sketch.line(-1077.5, 310, -952.5, 310);
            sketch.line(-777.5, 310, -627.5, 310);
            sketch.line(-1077.5, 67.5, -952.5, 67.5);
            sketch.line(-777.5, 67.5, -627.5, 67.5);
            sketch.line(-627.5, 362.5, -437.5, 362.5);
        }

        // Upper Engine
        sketch.noStroke();
        sketch.fill(108, 104, 98);
        sketch.beginShape();
        sketch.vertex(-1952.5, -30);
        sketch.vertex(-1952.5, -115);
        sketch.vertex(-1857.5, -115);
        sketch.vertex(-1807.5, -165);
        sketch.vertex(-1562.5, -165);
        sketch.vertex(-1562.5, -395);
        sketch.vertex(-1952.5, -395);
        sketch.vertex(-1827.5, -495);
        sketch.vertex(-1457.5, -495);
        sketch.vertex(-1457.5, -30);
        sketch.endShape();

        // Security-Reactor-Engine Cross-shape Road
        sketch.noStroke();
        sketch.fill(108, 104, 98);
        sketch.beginShape();
        sketch.vertex(-1742.5, -30);
        sketch.vertex(-1607.5, -30);
        sketch.vertex(-1607.5, 325);
        sketch.vertex(-1427.5, 325);
        sketch.vertex(-1427.5, 445);
        sketch.vertex(-1607.5, 445);
        sketch.vertex(-1607.5, 800);
        sketch.vertex(-1742.5, 800);
        sketch.vertex(-1742.5, 445);
        sketch.vertex(-1917.5, 445);
        sketch.vertex(-1917.5, 325);
        sketch.vertex(-1742.5, 325);
        sketch.endShape();

        sketch.fill(48, 62, 68)
        sketch.stroke(40, 54, 54);
        sketch.strokeWeight(5);
        sketch.rect(-1742.5, -30, -1607.5-(-1742.5), 20);
        sketch.rect(-1742.5, 800-20, -1607.5-(-1742.5), 20);

        // Admin
        // Desk
        sketch.stroke(0);
        sketch.strokeWeight(3);
        sketch.fill(91, 111, 102);
        sketch.rect(452.5, 653.5, 195, 117);
        
        sketch.stroke(22, 28, 28);
        sketch.strokeWeight(30);
        sketch.noFill();
        for (const wall of this.lightWalls) {
            if (wall.color) sketch.stroke(wall.color);
            sketch.line(wall.start.x, wall.start.y, wall.end.x, wall.end.y);
        }

        sketch.stroke(46, 49, 48);
        sketch.strokeWeight(15);
        for (const wall of this.lightWalls) {
            if (wall.color) sketch.stroke(wall.color);
            sketch.line(wall.start.x, wall.start.y, wall.end.x, wall.end.y);
        }

        sketch.stroke(50);
        sketch.strokeWeight(5);
        for (const wall of this.walkWalls) {
            if (wall.color) sketch.stroke(wall.color);
            sketch.line(wall.start.x, wall.start.y, wall.end.x, wall.end.y);
        }
    }
}
