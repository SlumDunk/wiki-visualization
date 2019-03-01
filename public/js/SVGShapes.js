
var Shape = function () {
    
};


Shape.prototype.setdefaults = function (fill, stroke, strokeWidth, ID) {
    this.fill = fill;
    this.stroke = stroke;
    this.strokWidth = strokeWidth;
    this.ID = ID;
 //   this.DivID = "";
};


Shape.prototype.HighLight = function () {
  
    var icon = document.getElementById(this.ID);

    icon.setAttribute("fill", ColorLuminance(this.fill, 0.3));
 


};

Shape.prototype.ShowVal = function (divID) {
    this.DivID = divID;

};

Shape.prototype.Revert = function () {
    var icon = document.getElementById(this.ID);
    icon.setAttribute("fill", this.fill);
   
};


// Shapes 
var Rectangle = function (x, y,  height,width, rx, ry) {
    Shape.call(this);
    this.x = x;
    this.y = y;
    this.rx = rx;
    this.ry = ry;
    this.w = width;
    this.h = height;
    
};

Rectangle.prototype = new Object(Shape.prototype);
Rectangle.prototype.constructor = Rectangle;

Rectangle.prototype.DisplayOpts = function (name,value) {
    this.name = name;
    this.value = value;
};

Rectangle.prototype.Draw = function () {
   
    var icon = document.createElementNS(SVG.ns, "rect");
    icon.setAttribute("x", this.x);
    icon.setAttribute("y", this.y);
    icon.setAttribute("rx", this.rx); // rounded corners
    icon.setAttribute("ry", this.ry); // rounded corners
    icon.setAttribute("id", this.ID);
    icon.setAttribute("width", this.w);
    icon.setAttribute("height", this.h);
    icon.setAttribute("fill", this.fill);
    icon.setAttribute("stroke", this.stroke);
    icon.setAttribute("stroke-width", this.strockWidth);
   // alert("hello");
    return icon;
};












var SetLabel  = function (x, y, fontFam, fontSize, color, Stroke, StrokeWidth, text,id) {
    var label = document.createElementNS(SVG.ns, "text");
    label.setAttribute("x", x); // to get the text a bit out - 20 
    label.setAttribute("y", y);
    label.setAttribute("font-family", fontFam);
    label.setAttribute("id", id);
    label.setAttribute("font-size", fontSize);
    label.setAttribute("stroke", Stroke);
    label.setAttribute("fill", color);
    label.setAttribute("stroke-width", StrokeWidth);
    label.setAttribute("text-anchor", "middle");

    //transform="rotate(30 20,40)"
    label.appendChild(document.createTextNode(text));
    return label;
}












//---------------================


// ----------Setting the Circle ----------//
function SetCircle(x, y, r, stroke, sWidth, fill, ID) {
    var circle = document.createElementNS(SVG.ns, "circle");
    circle.setAttribute("id", ID);
    circle.setAttribute("class", "InCircle");
    circle.setAttribute("cx", x); // to get the text a bit out - 20 
    circle.setAttribute("cy", y);
    circle.setAttribute("r", r);
    circle.setAttribute("stroke", stroke);
    circle.setAttribute("stroke-width", sWidth);
    circle.setAttribute("fill", fill);
    //  var anim = "SelectCircle("+ID + ")";
    // circle.setAttribute("onmousemove", anim);
    //  circle.setAttribute("style", "filter:url(#dropshadow)");// in case of shadow 
    return circle;
}

//------------Set the empty Path--------------//
function SetEmptyPath(ID, color) {

    var path = document.createElementNS(SVG.ns, "path");
    var defaultValues = [0, 0];
    var cmd = [];
    cmd.push("M" + defaultValues.join());
    path.setAttribute("d", cmd.join());
    path.setAttribute("fill", color);
    path.setAttribute("id", ID);
    path.setAttribute("stroke", color);
    path.setAttribute("stroke-width", "15"); // increase to make more rounded stucture 
    path.setAttribute("class", "Indow");
    path.setAttribute("stroke-linecap", "square");
    path.setAttribute("stroke-linejoin", "square");
    path.setAttribute("class", "SectorLink");
    // path.setAttribute("stroke-dasharray", "1, 1");
    //path.setAttribute("style", "filter:url(#dropshadow)");
    return path;
}

function SetPath(ID, color,d) {

    var path = document.createElementNS(SVG.ns, "path");
    var defaultValues = [0, 0];
    
    path.setAttribute("d", d);
    path.setAttribute("fill", color);
    path.setAttribute("id", ID);
    path.setAttribute("stroke", color);
    path.setAttribute("stroke-width", "15"); // increase to make more rounded stucture 
    path.setAttribute("class", "Indow");
    path.setAttribute("stroke-linecap", "square ");
    path.setAttribute("stroke-linejoin", "square ");
    path.setAttribute("class", "SectorLink");
    // path.setAttribute("stroke-dasharray", "1, 1");
    //path.setAttribute("style", "filter:url(#dropshadow)");
    return path;
}




function SetLabel(x, y, fontFam, fontSize, color, Stroke, StrokeWidth, text) {
    var label = document.createElementNS(SVG.ns, "text");
    label.setAttribute("x", x); // to get the text a bit out - 20 
    label.setAttribute("y", y);
    label.setAttribute("font-family", fontFam);
    label.setAttribute("font-size", fontSize);
    label.setAttribute("stroke", Stroke);
    label.setAttribute("fill", color);
    label.setAttribute("stroke-width", StrokeWidth);

    //  label.setAttribute("alignment-baseline", "hanging");
    label.setAttribute("text-anchor", "middle");

    label.appendChild(document.createTextNode(text));
    return label;
}

function createLink(id) {
    var link = document.createElementNS(SVG.ns, "a");
    link.setAttribute("xlink:href", "/svg/index.html");
    link.setAttribute("target", "_top");
    return link;
}

function CreateShadowFilter() {
    var filter = document.createElementNS(SVG.ns, "filter");
    filter.setAttribute("id", "dropshadow");
    filter.setAttribute("height", "120%");

    var feGaussianBlur = document.createElementNS(SVG.ns, "feGaussianBlur");
    feGaussianBlur.setAttribute("in", "SourceAlpha");
    feGaussianBlur.setAttribute("stdDeviation", "4");


    var feOffset = document.createElementNS(SVG.ns, "feOffset");
    feOffset.setAttribute("dx", "0.01");
    feOffset.setAttribute("dy", "0.01");
    feOffset.setAttribute("result", "offsetblur");

    var feMerge = document.createElementNS(SVG.ns, "feMerge");

    var feMergeNode0 = document.createElementNS(SVG.ns, "feMergeNode");

    var feMergeNode = document.createElementNS(SVG.ns, "feMergeNode");
    feMergeNode.setAttribute("in", "SourceGraphic");

    feMerge.appendChild(feMergeNode0);
    feMerge.appendChild(feMergeNode);


    filter.appendChild(feGaussianBlur);
    filter.appendChild(feOffset);
    filter.appendChild(feMerge);


    return filter;

}

// ---------------ENDS--Object Creation SVG  basic objects creation------------------//

function ColorLuminance(hex, lum) {

    // validate hex string
    hex = String(hex).replace(/[^0-9a-f]/gi, '');
    if (hex.length < 6) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    lum = lum || 0;

    // convert to decimal and change luminosity
    var rgb = "#", c, i;
    for (i = 0; i < 3; i++) {
        c = parseInt(hex.substr(i * 2, 2), 16);
        c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
        rgb += ("00" + c).substr(c.length);
    }

    return rgb;
}


function SetLine(x1, y1, x2, y2, fill, stroke, strokeWidth, strokeDash) {
    var line = document.createElementNS(SVG.ns, "line");
    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);
    line.setAttribute("fill", "none");
    line.setAttribute("stroke", stroke);
    line.setAttribute("stroke-width", strokeWidth);
    line.setAttribute("stroke-linecap", "round");
    line.setAttribute("stroke-linejoin", "round");
    //stroke-linejoin="round"
//stroke-linecap="round"

    if (strokeDash != "0")
        line.setAttribute("stroke-dasharray", strokeDash);
    return line;
}

//-====================================


// --------------------Make SVG Elements dom Creation -----------------------------//

///*******Writern by Pushparaj P. Parab*****///
///******Version 0.0********///


var SVG = {};
SVG.ns = "http://www.w3.org/2000/svg";
SVG.xlinkns = "http://www.w3.org/1999/xlink";
SVG.makeCanvas = function (id, pixelWidth, pixelHeight, userWidth, userHeight) {
    var svg = document.createElementNS(SVG.ns, "svg");
    svg.setAttribute("id", id);
    svg.setAttribute("width", pixelWidth);
    svg.setAttribute("height", pixelHeight);
    svg.setAttribute("version", "1.1");
    svg.setAttribute("viewBox", "0 0 " + userWidth  + " " + (userHeight ));
    svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", SVG.xlinkns);
    return svg;
};



SVG.makeCanvasForLine = function (id, pixelWidth, pixelHeight, userWidth, userHeight) {
    var svg = document.createElementNS(SVG.ns, "svg");
    svg.setAttribute("id", id);
    svg.setAttribute("width", 1120);
    svg.setAttribute("height", 550);
    svg.setAttribute("version", "1.1");
    svg.setAttribute("viewBox", "0 0 1150 550");
    svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", SVG.xlinkns);
    return svg;
};

SVG.makeDataURL = function (canvas) {
    var text = (new XMLSerializer()).serializeToString(canvas);
    var encodedText = encodeURIComponent(text);
    return "data:image/svg+xml," + encodedText;
};

SVG.makeObjectTag = function (canvas, width, height) {
    var Object = document.createElement("Object");
    Object.width = width;
    Object.height = height;
    Object.id = "MySVG";
    Object.data = SVG.makeDataURL(canvas);
    Object.type = "image/svg+xml";
    return Object;
}
function ColorLuminance(hex, lum) {

    // validate hex string
    hex = String(hex).replace(/[^0-9a-f]/gi, '');
    if (hex.length < 6) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    lum = lum || 0;

    // convert to decimal and change luminosity
    var rgb = "#", c, i;
    for (i = 0; i < 3; i++) {
        c = parseInt(hex.substr(i * 2, 2), 16);
        c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
        rgb += ("00" + c).substr(c.length);
    }

    return rgb;
}

// custom for the chart 

function SetEmptyPathForDowChart(ID, color,visibility,opacity) {

    var path = document.createElementNS(SVG.ns, "path");
    var defaultValues = [0, 0];
    var cmd = [];
    cmd.push("M" + defaultValues.join());
    path.setAttribute("d", cmd.join());
    path.setAttribute("fill", color);
    path.setAttribute("id", ID);
    path.setAttribute("stroke", color);
    path.setAttribute("stroke-width", "0"); // increase to make more rounded stucture 
    path.setAttribute("stroke-linecap", "square");
    path.setAttribute("stroke-linejoin", "square");
    path.setAttribute("class", "SectorLink");
    path.setAttribute("visibility", visibility);
    path.setAttribute("opacity", opacity);
    return path;
}








function SetRectLineChart(x, y, width, height, fill, strock, strockWidth, ID) {
    var icon = document.createElementNS(SVG.ns, "rect");
    icon.setAttribute("x", x);
    icon.setAttribute("y", y);
    icon.setAttribute("width", width);
    icon.setAttribute("height", height);
    icon.setAttribute("fill", fill);
    icon.setAttribute("stroke", strock);
    icon.setAttribute("stroke-width", strockWidth);
    icon.setAttribute("id", ID);
    return icon;
}


function SetLineChartLine(x1, y1, x2, y2, fill, stroke, strokeWidth, strokeDash, ID) {
    var line = document.createElementNS(SVG.ns, "line");
    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);
    line.setAttribute("fill", fill);
    line.setAttribute("stroke", stroke);
    line.setAttribute("stroke-width", strokeWidth);
    line.setAttribute("id", ID);
    if (strokeDash != "0")
        line.setAttribute("stroke-dasharray", strokeDash);
    return line;
}


function SetLableLineChartVertical(x, y, fontFam, fontSize, Stroke, StrokeWidth, text) {
    var label = document.createElementNS(SVG.ns, "text");
    label.setAttribute("x", x); // to get the text a bit out - 20 
    label.setAttribute("y", y);
    label.setAttribute("font-family", fontFam);
    label.setAttribute("font-size", fontSize);
    label.setAttribute("stroke", Stroke);
    label.setAttribute("stroke-width", StrokeWidth);
   // label.setAttribute("transform", "rotate(30 20,40)");
     label.setAttribute("writing-mode", "tb");
  
     //rotate="-90"
    //writing-mode="tb"
    label.appendChild(document.createTextNode(text));
    return label;
}


function SetLableLineChart(x, y, fontFam, fontSize, Stroke, StrokeWidth, text) {
    var label = document.createElementNS(SVG.ns, "text");
    label.setAttribute("x", x); // to get the text a bit out - 20 
    label.setAttribute("y", y);
    label.setAttribute("font-family", fontFam);
    label.setAttribute("font-size", fontSize);
    label.setAttribute("stroke", Stroke);
    label.setAttribute("stroke-width", StrokeWidth);
   // label.setAttribute("transform", "rotate(30 20,40)");
     //label.setAttribute("writing-mode", "tb");
    //writing-mode="tb"
    label.appendChild(document.createTextNode(text));
    return label;
}


function SetLineChartCircle(x, y, r, stroke, sWidth, fill, ID) {
    var circle = document.createElementNS(SVG.ns, "circle");
    circle.setAttribute("cx", x); // to get the text a bit out - 20 
    circle.setAttribute("cy", y);
    circle.setAttribute("r", r);
    circle.setAttribute("stroke", stroke);
    circle.setAttribute("stroke-width", sWidth);
    circle.setAttribute("fill", fill);
    circle.setAttribute("id", ID);
    return circle;
}



var ToolTip = {};
ToolTip.make = function (unique_id) {
    var div = document.createElement("div");
    div.setAttribute("id", unique_id);
    div.setAttribute("class", "ToolTip");//style
    return div;
};
