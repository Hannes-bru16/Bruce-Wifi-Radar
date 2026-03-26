// =============================================
// Wifi Radar for LilyGo T-Embed + Bruce
// =============================================
var display = require("display");
var wifi = require("wifi");
var keyboard = require("keyboard");

var BLACK = display.color(0, 0, 0);
var GREEN = display.color(0, 255, 100);
var WHITE = display.color(255, 255, 255);
var RED   = display.color(255, 50, 50);

display.fill(BLACK);
display.setTextColor(GREEN);
display.setTextSize(2);
display.setTextAlign("center", "top");

function drawRadarHeader() {
    display.fill(BLACK);
    display.drawFillCircle(80, 35, 30, GREEN);   // Radar-Circle
    display.drawCircle(80, 35, 45, GREEN);
    display.setCursor(5, 5);
    display.println("AIR RADAR WLAN");
    display.setTextSize(1);
    display.setCursor(5, 75);
    display.println("Scan alle 4s • Sel=Rescan • Esc=Exit");
}

var running = true;
while (running) {
    drawRadarHeader();

    var nets = wifi.scan();   // makes Array with SSID, MAC, encryptionType

    display.setTextColor(WHITE);
    display.setCursor(5, 95);

    if (nets.length === 0) {
        display.println("Keine Netze gefunden...");
    } else {
        for (var i = 0; i < nets.length && i < 8; i++) {   
            var rssiBar = "███";   
            if (nets[i].RSSI) {  
                var strength = Math.floor((nets[i].RSSI + 100) / 20);
                rssiBar = "";
                for (var s = 0; s < strength; s++) rssiBar += "█";
            }
            display.println((i+1) + ". " + nets[i].SSID.substring(0, 18) + " " + rssiBar);
            display.println("   " + nets[i].MAC);
        }
    }

    display.setTextColor(RED);
    display.setCursor(5, display.height() - 20);
    display.println("Geräte: " + nets.length);

    // 4 Sekunden warten + Button-Check
    var timeout = now() + 4000;
    while (now() < timeout) {
        if (keyboard.getSelPress(true)) {   
            break;
        }
        if (keyboard.getEscPress(true)) {  
            running = false;
            break;
        }
        delay(50);
    }
}

// Cleanup
display.fill(BLACK);
display.setCursor(30, 60);
display.setTextColor(GREEN);
display.println("Radar done");
delay(1500);