
///*******Writern by Pushparaj P. Parab*****///
///******Version 0.2********///

///Used to Check if its a Mobile Device
window.mobilecheck = function () {
    var check = false;
    (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od|ad)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
}

var st;// Declared for the touch events // mobile 
var DowChart = function (r, DowChart, divID, w, h) {

    this.DowChart = DowChart;
    this.divID = divID;
    this.w = w;
    this.h = h;
    this.r = r-5; // redice the Radius by 5 

    //Own Properties
    this.total = 0;
    this.angles = [];
    this.displayAngle = [];
    this.startAngle = 0;
    this.x1 = 0;
    this.y1 = 0;
    this.x2 = 0;
    this.y2 = 0;
    this.cx = this.w / 2;  //Center x
    this.cy = this.h / 2;  //Center y

    this.HoverMax = 9;
    this.HoverSeparation = 3;
    this.RingRadius = 35;

};

function getInCircleID(divID) { return divID + "InnCircle"; }
function getInT1ID(divID) { return divID + "T1"; }
function getInT2ID(divID) { return divID + "T2"; }

DowChart.prototype.Draw = function () {

    this.canvas = SVG.makeCanvas("canvas", this.h, this.w, this.h, this.w);
    if (typeof canvas == "string")
        canvas = document.getElementById(canvas);


    var count = 0;
    this.allZero = true;
    this.CPCount = 0;
    this.onlyOne = 0;
    for (i in this.DowChart) {
        if (this.DowChart.hasOwnProperty(i)) {
            var key = i;
            if (this.DowChart[i].Val != 0) { this.allZero = false; this.CPCount++; this.onlyOne = i }
            this.total += this.DowChart[i].Val;
        }
    }

   
    var G = this.DowChart[0].Val;
   
    var Gi = 0;
    for (i in this.DowChart) {
        if (i > 0) {
            if (G < this.DowChart[i].Val) {
                G = this.DowChart[i].Val;
                Gi = i;
            }
        }
    }


    this.LargI = (G * 10);
    this.SingleG = G;
    for (i in this.DowChart) {
        if (this.DowChart.hasOwnProperty(i)) {
            var key = i;
            this.angles[key] = this.DowChart[key].Val / this.total * Math.PI * 2;
            this.displayAngle[key] = (this.DowChart[i].Val / this.total * 360);
        }
    }
    this.data = [];
    this.moveX = [];
    this.moveY = [];
    this.seq = 0;
    this.clicked = [];
  
    var dVal = "";
    var dName = "";
    var color = "#bbb"; // default the color
    if (this.allZero) { dVal = "0"; dName = "Pending Items"; } // if Dval is zero//
    else {
        if (this.CPCount == 1) {
            dVal = this.DowChart[this.onlyOne].Val;
            dName = this.DowChart[this.onlyOne].Name;
            color = this.DowChart[this.onlyOne].Color;
        }
        else {
            dVal = this.total;
            dName = "Total Records"; // Intructions set here 
        }
    }


    var cir = this.canvas.appendChild(SetCircle(this.cx, this.cy, this.r - this.RingRadius - 5, "#f0f0f0", "1", "#fff", getInCircleID(this.divID)));
    var link = this.canvas.appendChild(SetLabel(this.cx, this.cy, "sans-serif", "40", color, color, "1", dVal, getInT1ID(this.divID)));
    var link2 = this.canvas.appendChild(SetLabel(this.cx, this.cy + 20, "sans-serif", "12", "#bbb", "#bbb", "0.2", dName, getInT2ID(this.divID)));
    for (i in this.DowChart) {
        this.data[i] = this.DowChart[i].Val;
        this.clicked[i] = false;

    }

    var t = document.createElement("table");
    t.id = "tableDynamic";
    var tbody = document.createElement("tbody");
    CreateHeaderForG(tbody);
    // start from here 
    for (i in this.DowChart) {
        if (this.DowChart.hasOwnProperty(i)) {
            var key = i;


           

            this.endangle = this.startAngle + this.angles[key];
            this.Points = [
                [this.cx + this.r * Math.sin(this.startAngle), this.cy - this.r * Math.cos(this.startAngle)],
                [this.cx + this.r * Math.sin(this.endangle), this.cy - this.r * Math.cos(this.endangle)]
            ];

            this.Center_Radius = [
               [this.cx, this.cy], [this.r, this.r]
            ];

            this.big = 0;
            if (this.endangle - this.startAngle > Math.PI)
                this.big = 1;

            var path = document.createElementNS(SVG.ns, "path");
            var g = document.createElementNS(SVG.ns, "g");

            var cmds = [];
            cmds.push("M" + this.Center_Radius[0].join());
            cmds.push("L" + this.Points[0].join());
            cmds.push("A" + this.Center_Radius[1].join());
            cmds.push([0, this.big, 1].join());
            cmds.push(this.Points[1].join());
            cmds.push("z");

            var d = cmds.join(" "); // original, with out any animation

            var emptyPath = SetEmptyPathForDowChart(IdGenDowChart(this.divID, key), this.DowChart[i].Color, "visible", "1");
            var emptyPath2 = SetEmptyPathForDowChart(IdGenDowChart(this.divID + "_Outer_", key), this.DowChart[i].Color, "hidden","0.5");

            var hover = DowChartBindHover(this, emptyPath, i);
            var click = DowChartBindClick(this, emptyPath, i);

            if (window.mobilecheck()) { // if mobile device then change the events
                Hevt = "touchstart";
                Cevt = "touchend";
            }
            else {
                Hevt = "mouseover";
                Cevt = "mousedown";
            }


            var OnBothMouseOut = OuterEvtDowNutBinder(this);
           // ShowBothRect.addEventListener("mouseout", OnBothRectMouseOut, false);

            ///

            var tr = document.createElement("tr");
            tr.setAttribute("class", "SectorLink");
            

            for (var key in this.DowChart[i]) {
                if (key != "__type") {

                    if (key == "StatusID") {
                        var td = document.createElement("td");
                        var text = document.createTextNode(parseInt(i) + 1);
                        td.appendChild(text);
                        tr.appendChild(td);
                    }

                    if (key == "Color") {

                        var div = document.createElement("div");
                        div.className = "colorDiv";
                        div.setAttribute("style", "background-color:" + this.DowChart[i][key]);

                        var td = document.createElement("td");
                        td.setAttribute("style", " vertical-align:middle;text-align:center;margin:auto;");

                        td.appendChild(div);
                        tr.appendChild(td);
                    } else if (key != "StatusID" && key != "ExtraParams") {
                        var td = document.createElement("td");
                        var text = document.createTextNode(this.DowChart[i][key]);
                        td.appendChild(text);
                        tr.appendChild(td);
                    }
                }


                // alert( pData[i][key]);
            }
           
            tbody.appendChild(tr);

            ///

            
            emptyPath.addEventListener(Hevt, hover, false);
            emptyPath.addEventListener(Cevt, click, false);
            emptyPath.addEventListener("mouseout",OnBothMouseOut,false);
            tr.addEventListener(Hevt, hover, false);
            tr.addEventListener("mouseout", OnBothMouseOut, false);
            tr.addEventListener(Cevt, click, false);

            g.appendChild(emptyPath);
            g.appendChild(emptyPath2);
            this.canvas.appendChild(g);
            this.startAngle = this.endangle;

            this.canvas.setAttribute("class", "img-responsive");
            this.canvas.setAttribute("style", "width:300px;height:300px;");
           

            var SVGCanvas = document.getElementById(this.divID);
            SVGCanvas.appendChild(this.canvas);

        }

        var u = document.getElementById("TableDiv");
        t.appendChild(tbody);
        u.appendChild(t);
        t.className = "table table-condensed table-hover";

    }
    for (i in this.DowChart) {
        if (this.DowChart.hasOwnProperty(i)) {

            var self = this;
            new DowChartSectorAnimate(self, i);
        }
    }


};


function DowChartSetLink(obj, sector, i) {
  
    var d = new Date();
    var n = d.getTime();
    var diff = n - st;
    var ExtraParams = "";
   
    if (obj.DowChart[i].ExtraParams != "") {
        ExtraParams = "&Extra=" + obj.DowChart[i].ExtraParams;
    }

    if (window.mobilecheck()) { // set the links here 
        if (diff > 1000) {
            callRecors(obj.DowChart[i].StatusID,obj.DowChart[i].Name);
        }
    } else {

        callRecors(obj.DowChart[i].StatusID, obj.DowChart[i].Name);
    }
   
}


function DowChartMove(obj, sector, i) {

    var d = new Date();
    var n = d.getTime();
    st = 0;
    st = n;


    for (secIn in obj.DowChart) {
        var eachID = IdGenDowChart(obj.divID, secIn);
        var elm = document.getElementById(eachID);
        var OuterCircleEach = document.getElementById(IdGenDowChart(obj.divID + "_Outer_", secIn));

        OuterCircleEach.setAttribute("visibility", "hidden");
        obj.clicked[secIn] = false;
    }

    var cir = document.getElementById(getInCircleID(obj.divID));
    var ciro = document.getElementById(IdGenDowChart(obj.divID + "_Outer_", i));

    //Text Color Change 
    var t1 = document.getElementById(getInT1ID(obj.divID));
    var t2 = document.getElementById(getInT2ID(obj.divID));

    ciro.setAttribute("visibility", "visible");

    if (!obj.clicked[i]) {
        obj.clicked[i] = true;

        t1.setAttribute("stroke", obj.DowChart[i].Color);
        t1.setAttribute("fill",obj.DowChart[i].Color);

        while (t1.firstChild) {
            t1.removeChild(t1.firstChild);
        }
        while (t2.firstChild) {
            t2.removeChild(t2.firstChild);
        }
        t1.appendChild(document.createTextNode(obj.DowChart[i].Val));
        t2.appendChild(document.createTextNode(obj.DowChart[i].Name));

    }
    else {
        obj.clicked[i] = false;
    }

}

function DowChartBindHover(obj, sector, i) {
    return function () { DowChartMove(obj, sector, i) };
}


function MouseOut(obj)
{
    for (secIn in obj.DowChart) {
        var eachID = IdGenDowChart(obj.divID, secIn);
        var elm = document.getElementById(eachID);
        var OuterCircleEach = document.getElementById(IdGenDowChart(obj.divID + "_Outer_", secIn));
        OuterCircleEach.setAttribute("visibility", "hidden");
        //obj.clicked[secIn] = false;
    }

    var t1 = document.getElementById(getInT1ID(obj.divID));
    var t2 = document.getElementById(getInT2ID(obj.divID));
    

    while (t1.firstChild) {
        t1.removeChild(t1.firstChild);
    }
    while (t2.firstChild) {
        t2.removeChild(t2.firstChild);
    }



    t1.setAttribute("stroke", "#bbb");
    t1.setAttribute("fill", "#bbb");

    t1.appendChild(document.createTextNode(obj.total));
    t2.appendChild(document.createTextNode("Total Records"));


  
}

function OuterEvtDowNutBinder(obj)
{
    return function () { MouseOut(obj) };
}

function DowChartBindClick(obj, sector, i) {
    return function () { DowChartSetLink(obj, sector, i) };
}

function IdGenDowChart(divID, toAppend) {
    return divID + "_" + "DowChartSector" + "_" + toAppend;
}


var DowChartSectorAnimate = function (DowChart, i) {

    this.Factor = DowChart.LargI;
    this.ori = DowChart;
    this.total = DowChart.total;
    this.DowChart = DowChart.DowChart;
    var self = this;
    this.key = i;
    this.anglesOld = DowChart.angles;
    this.OriginalEnd = (DowChart.DowChart[i].Val / this.total) * (2 * Math.PI);
    this.icc = (this.Factor / 360);
    this.OIcc = (DowChart.SingleG / 360)
   
    //own properties 
    this.Inc = 0;
    this.startangle = 0;
    this.endangle = 0;
    this.angles = 0;


    if (this.key == 0) {
        this.startangle = 0;
    } else {
        for (var j = this.key; j >= 0; j--) {
            if (j >= 1) {
                var h = j - 1;
                this.startangle = this.startangle + this.anglesOld[h];
            } else {
                this.startangle = this.startangle + 0;
            }
        }

    }
    this.r = 0;
    this.GInterval = setInterval(function () { self.change(); }, 1 / 10);

};




DowChartSectorAnimate.prototype.change = function () {
    if (this.OriginalEnd == (2 * Math.PI)) {

        this.OriginalEnd = this.OriginalEnd - ( (this.OIcc / this.total) * 2 * Math.PI);
    }

    if (this.Inc < this.OriginalEnd & (this.key == this.ori.seq)) {

        this.Inc = this.Inc + ((this.icc / this.total) * 2 * Math.PI);
         
        this.Inc = this.Inc > this.OriginalEnd ? this.OriginalEnd : this.Inc;
        this.angles = (this.Inc); 


        this.endangle = this.startangle + this.angles;


        this.Points = [ // points
         [this.ori.cx + (this.ori.r) * Math.cos(this.startangle),
          this.ori.cy + (this.ori.r) * Math.sin(this.startangle)],
         [this.ori.cx + (this.ori.r) * Math.cos(this.endangle),
          this.ori.cy + (this.ori.r) * Math.sin(this.endangle)],
         [this.ori.cx + (this.ori.r - this.ori.RingRadius) * Math.cos(this.endangle),
          this.ori.cy + (this.ori.r - this.ori.RingRadius) * Math.sin(this.endangle)],
         [this.ori.cx + (this.ori.r - this.ori.RingRadius) * Math.cos(this.startangle),
          this.ori.cy + (this.ori.r - this.ori.RingRadius) * Math.sin(this.startangle)],
        ];

 
        this.PointsOuter = [ // points
        [this.ori.cx + (this.ori.r + this.ori.HoverMax) * Math.cos(this.startangle),
         this.ori.cy + (this.ori.r + this.ori.HoverMax) * Math.sin(this.startangle)],
        [this.ori.cx + (this.ori.r + this.ori.HoverMax) * Math.cos(this.endangle),
         this.ori.cy + (this.ori.r + this.ori.HoverMax) * Math.sin(this.endangle)],
        [this.ori.cx + (this.ori.r + this.ori.HoverSeparation) * Math.cos(this.endangle),
         this.ori.cy + (this.ori.r + this.ori.HoverSeparation) * Math.sin(this.endangle)],
        [this.ori.cx + (this.ori.r + this.ori.HoverSeparation) * Math.cos(this.startangle),
         this.ori.cy + (this.ori.r + this.ori.HoverSeparation) * Math.sin(this.startangle)],
        ];


        var angleDiff = this.endangle - this.startangle;
        var largeArc = (angleDiff % (Math.PI * 2)) > Math.PI ? 1 : 0;
        var cmds = [];
        cmds.push("M" + this.Points[0].join());                                // Move to P0
        cmds.push("A" + [(this.ori.r), (this.ori.r), 0, largeArc, 1, this.Points[1]].join()); // Arc to  P1
        cmds.push("L" + this.Points[2].join());                                // Line to P2
        cmds.push("A" + [(this.ori.r - this.ori.RingRadius), (this.ori.r - this.ori.RingRadius), 0, largeArc, 0, this.Points[3]].join()); // Arc to  P3
        cmds.push("z");


        var cmds2 = [];
        cmds2.push("M" + this.PointsOuter[0].join());                                // Move to P0
        cmds2.push("A" + [(this.ori.r + this.ori.HoverMax), (this.ori.r + this.ori.HoverMax), 0, largeArc, 1, this.PointsOuter[1]].join()); // Arc to  P1
        cmds2.push("L" + this.PointsOuter[2].join());                                // Line to P2
        cmds2.push("A" + [(this.ori.r + this.ori.HoverSeparation), (this.ori.r + this.ori.HoverSeparation), 0, largeArc, 0, this.PointsOuter[3]].join()); // Arc to  P3
        cmds2.push("z");

        var id = document.getElementById(IdGenDowChart(this.ori.divID, this.key));
        id.setAttribute("d", cmds.join(" "));


        var id2 = document.getElementById(IdGenDowChart(this.ori.divID + "_Outer_", this.key));
        id2.setAttribute("d", cmds2.join(" "));

    }
    else {
        if (this.ori.seq == this.key) {
            clearInterval(this.GInterval);
            this.ori.seq = parseInt(this.key) + 1;
        }
    }




}





function CreateTD(val) {
    var td = document.createElement("th");
    var text = document.createTextNode(val);
    td.appendChild(text);
    return td;
}

function CreateHeaderForG(tBody) {
    var tr = document.createElement("tr");

    tr.appendChild(CreateTD("#"));
    tr.appendChild(CreateTD("Color"));
    tr.appendChild(CreateTD("Status Name"));
    tr.appendChild(CreateTD("Count"));

    tBody.appendChild(tr);
}