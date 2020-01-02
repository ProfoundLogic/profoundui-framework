//  Profound UI Runtime  -- A Javascript Framework for Rich Displays
//  Copyright (c) 2020 Profound Logic Software, Inc.
//
//  This file is part of the Profound UI Runtime
//
//  The Profound UI Runtime is free software: you can redistribute it and/or modify
//  it under the terms of the GNU Lesser General Public License as published by
//  the Free Software Foundation, either version 3 of the License, or
//  (at your option) any later version.
//
//  The Profound UI Runtime is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
//  GNU Lesser General Public License for more details.
//
//  You should have received a copy of the GNU Lesser General Public License
//  In the COPYING and COPYING.LESSER files included with the Profound UI Runtime.
//  If not, see <http://www.gnu.org/licenses/>.



var toolbar = null;
var screenPropertiesObj = new Object();
var cachedPropertiesModel = null;
var cachedPropertiesNamedModel = null;
var cachedScreens = {};

pui.suppressPropertyScriptingErrors = false;

/**
 * Return some formatted HTML describing a property.
 * @param {String} defVal   The default value the property uses.
 * @param {String} descVal  Description text of the property.
 * @param {Undefined|Array} descAdd   Cause additional, boilerplate descriptions to be added.
 * @param {Undefined|String} noteVal  If a note is passed, it's added to the end of the text.
 * @returns {String}
 */
pui.helpTextProperties = function(defVal, descVal, descAdd, noteVal) {
  var codeOpen = "<code class='propdefault'>";
  var codeClose = "</code>";

  var falseSpan = "<span title='The default value of the property is false.'>false</span>";
  var trueSpan = "<span title='The default value of the property is true.'>true</span>";

  var blankSpan = "<span title='The default value of the property is unset or not defined.'>[blank]</span>";

  var cssSpan = "[<span title='The default value is the value defined in the CSS &#010;(theme/developer CSS classes defined in a CSS&#010;file or \"style\" DOM attribute) for the element.'>CSS value</span>]";

  var placeholderSpan = "[<span title='The default value of the property is placeholder &#010;text, such as \"Lorem Ipsum...\" or \"HTML Content\".'>placeholder text</span>]";

  var browserSpan = "[<span title='The default is determined by the browser for the element.'>browser setting</span>]";

  var widgetSpan = "[<span title='The default value of this property is determined by the selected widget.'>selected widget</span>]";

  var themeSpan = "[<span title='The default value of this property is based on the selected widget and its theme/template/purpose.'>selected widget</span>]";

  var skinSpan = "[<span title='The default value of this property is determined by &#010;the selected skin and its defaults, CSS, and/or JavaScript customizations.'>selected skin</span>]";

  var idSpan = "[<span title='The default ID is based on the name of the selected &#010;widget with no spaces and the first letter of each word capitalized.'>WidgetName</span>][<span title='A whole number value starting from 1 determined by how many of the same widget have previously been added to the Design grid.'>number</span>]";

  var positionSpan = "[<span title='The default values are determined by where the &#010;widget is dropped/placed on the Designer grid.'>user drop point</span>]";

  var bindSpan = "<span title='This property requires being bound and a value passed to or from your program.'>[bound value]</span>";

  var otherText = " The 'Other...' option can be selected to write in a custom value.";
  var pixelText = "Specify in pixels. <br><br>Example: " + codeOpen + "12px" + codeClose;

  var listStyleTag = "<style>ul.listing {display: block; list-style-type: disc; padding-left: 10px; margin-left: 15px;}</style>";
  var optionsOpen = "<hr><span style='font-weight:bold;'>Valid options</span>: <br><ul class='listing'><li>";

  var overflowOptions = listStyleTag + optionsOpen +
    codeOpen + "visible" + codeClose + " - lets the content flow beyond the dimensions of the element without a scrollbar.</li><li>" +
    codeOpen + "hidden" + codeClose + " - does not display a scrollbar and hides overflowing content.</li><li>" +
    codeOpen + "scroll" + codeClose + " - always displays the scrollbar.</li><li>" +
    codeOpen + "auto" + codeClose + " - displays the scrollbar only when the element's content goes beyond the elements dimensions.</li></ul>";

  var fontOptions = "<hr><span style='font-weight:bold;'>Valid Font Families</span>: <select style='background-color: #eee; border:none; width: 125px; height: 14px; font-size: 12px; font-family: Arial;'>" +
    "<option>Font Family List</option>" +
    "<optgroup label='Serif'>" +
    "<option style='font-family: Georgia, serif !important;'>Georgia, serif</option>" +
    "<option style='font-family:'Palatino Linotype', 'Book Antiqua', Palatino, serif !important;'>'Palatino Linotype', 'Book Antiqua', Palatino, serif</option>" +
    "<option style='font-family: 'Times New Roman', Times, serif !important;'>'Times New Roman', Times, serif</option>" +
    "</optgroup>" +
    "<optgroup label='Sans-Serif'>" +
    "<option style='font-family: Arial, Helvetica, sans-serif !important;'>Arial, Helvetica, sans-serif</option>" +
    "<option style='font-family: 'Arial Black', Gadget, sans-serif !important;'>'Arial Black', Gadget, sans-serif</option>" +
    "<option style='font-family: 'Comic Sans MS', cursive, sans-serif !important;'>'Comic Sans MS', cursive, sans-serif</option>" +
    "<option style='font-family: Impact, Charcoal, sans-serif !important;'>&nbsp;&nbsp;&nbsp;Impact, Charcoal, sans-serif</option>" +
    "<option style='font-family: 'Lucida Sans Unicode', 'Lucida Grande', sans-serif !important;'>'Lucida Sans Unicode', 'Lucida Grande', sans-serif</option>" +
    "<option style='font-family: Tahoma, Geneva, sans-serif !important;'>Tahoma, Geneva, sans-serif</option>" +
    "<option style='font-family: 'Trebuchet MS', Helvetica, sans-serif !important;'>'Trebuchet MS', Helvetica, sans-serif</option>" +
    "<option style='font-family: Verdana, Geneva, sans-serif !important;'>Verdana, Geneva, sans-serif</option>" +
    "</optgroup>" +
    "<optgroup label='Monospace'>" +
    "<option style='font-family: 'Courier New', Courier, monospace !important;'>'Courier New', Courier, monospace</option>" +
    "<option style='font-family: 'Lucida Console', Monaco, monospace !important;'>'Lucida Console', Monaco, monospace</option>" +
    "</optgroup>" +
    "</select>" +
    "<br>All other fonts must be imported in some manner.<br><br>Example:" + codeOpen + "<br>@font-face {" +
    "<br>&ensp; font-family: myCustomFont;" +
    "<br>&ensp; src: url('myCustomFont.ttf');" +
    "<br>}" + codeClose + "<br><br>&#x1F6D1 Make sure your font file extension is supported in the browsers users will be using before attempting this.";

  var colorOptions = "<hr><span style='font-weight:bold;'>Usage</span>: Enter a color name, hex, or select a color." +
    "<hr><span style='font-weight:bold;'>Valid Color Names</span>: " +
    "<select style='background-color: #eee; border:none; width: 125px; height: 14px; font-size: 12px; font-family: Arial;'>" +
    "<option>Text Colors</option>" +
    "<option style='font-weight: bold; background-color: #71706F !important; color: AliceBlue;'>AliceBlue</option>" +
    "<option style='font-weight: bold; background-color: #716363 !important; color: AntiqueWhite;'>AntiqueWhite</option>" +
    "<option style='font-weight: bold; background-color: #716363 !important; color: Aqua;'>Aqua</option>" +
    "<option style='font-weight: bold; background-color: #716363 !important; color: Aquamarine;'>Aquamarine</option>" +
    "<option style='font-weight: bold; background-color: #8A6C6C !important; color: Azure;'>Azure</option>" +
    "<option style='font-weight: bold; background-color: #716C6F !important; color: Beige;'>Beige</option>" +
    "<option style='font-weight: bold; background-color: #686964 !important; color: Bisque;'>Bisque</option>" +
    "<option style='font-weight: bold; background-color: #828282 !important; color: Black;'>Black</option>" +
    "<option style='font-weight: bold; background-color: #825A5A !important; color: BlanchedAlmond;'>BlanchedAlmond</option>" +
    "<option style='font-weight: bold; background-color: #E6E6D3 !important; color: Blue;'>Blue</option>" +
    "<option style='font-weight: bold; background-color: #E3E3E2 !important; color: BlueViolet;'>BlueViolet</option>" +
    "<option style='font-weight: bold; background-color: #D9D2D2 !important; color: Brown;'>Brown</option>" +
    "<option style='font-weight: bold; background-color: #483723 !important; color: BurlyWood;'>BurlyWood</option>" +
    "<option style='font-weight: bold; background-color: #201822 !important; color: CadetBlue;'>CadetBlue</option>" +
    "<option style='font-weight: bold; background-color: #465040 !important; color: Chartreuse;'>Chartreuse</option>" +
    "<option style='font-weight: bold; background-color: #080901 !important; color: Chocolate;'>Chocolate</option>" +
    "<option style='font-weight: bold; background-color: #372821 !important; color: Coral;'>Coral</option>" +
    "<option style='font-weight: bold; background-color: #241A20 !important; color: CornflowerBlue; '>CornflowerBlue</option>" +
    "<option style='font-weight: bold; background-color: #695C30 !important; color: Cornsilk;'>Cornsilk</option>" +
    "<option style='font-weight: bold; background-color: #F6F6F3 !important; color: Crimson;'>Crimson</option>" +
    "<option style='font-weight: bold; background-color: #4A5469 !important; color: Cyan;'>Cyan</option>" +
    "<option style='font-weight: bold; background-color: #95A5A2 !important; color: DarkBlue;'>DarkBlue</option>" +
    "<option style='font-weight: bold; background-color: #0B040E !important; color: DarkCyan;'>DarkCyan</option>" +
    "<option style='font-weight: bold; background-color: #211412 !important; color: DarkGoldenRod;'>DarkGoldenRod</option>" +
    "<option style='font-weight: bold; background-color: #2C2C2C !important; color: DarkGray;'>DarkGray</option>" +
    "<option style='font-weight: bold; background-color: #CCCCCC !important; color: DarkGreen;'>DarkGreen</option>" +
    "<option style='font-weight: bold; background-color: #403129 !important; color: DarkKhaki;'>DarkKhaki</option>" +
    "<option style='font-weight: bold; background-color: #C3D4D9 !important; color: DarkMagenta;'>DarkMagenta</option>" +
    "<option style='font-weight: bold; background-color: #DEE7ED !important; color: DarkOliveGreen;'>DarkOliveGreen</option>" +
    "<option style='font-weight: bold; background-color: #372C21 !important; color: DarkOrange;'>DarkOrange</option>" +
    "<option style='font-weight: bold; background-color: #E4E6D6 !important; color: DarkOrchid;'>DarkOrchid</option>" +
    "<option style='font-weight: bold; background-color: #BBBFAC !important; color: DarkRed;'>DarkRed</option>" +
    "<option style='font-weight: bold; background-color: #3A2923 !important; color: DarkSalmon;'>DarkSalmon</option>" +
    "<option style='font-weight: bold; background-color: #16353F !important; color: DarkSeaGreen;'>DarkSeaGreen</option>" +
    "<option style='font-weight: bold; background-color: #D9CBCB !important; color: DarkSlateBlue;'>DarkSlateBlue</option>" +
    "<option style='font-weight: bold; background-color: #D1D1D1 !important; color: DarkSlateGray;'>DarkSlateGray</option>" +
    "<option style='font-weight: bold; background-color: #1D393B !important; color: DarkTurquoise;'>DarkTurquoise</option>" +
    "<option style='font-weight: bold; background-color: #EBEDED !important; color: DarkViolet;'>DarkViolet</option>" +
    "<option style='font-weight: bold; background-color: #1B0E1E !important; color: DeepPink;'>DeepPink</option>" +
    "<option style='font-weight: bold; background-color: #053725 !important; color: DeepSkyBlue;'>DeepSkyBlue</option>" +
    "<option style='font-weight: bold; background-color: #EBEBEB !important; color: DimGray;'>DimGray</option>" +
    "<option style='font-weight: bold; background-color: #2A1237 !important; color: DodgerBlue;'>DodgerBlue</option>" +
    "<option style='font-weight: bold; background-color: #E0E6CE !important; color: FireBrick;'>FireBrick</option>" +
    "<option style='font-weight: bold; background-color: #69604C !important; color: FloralWhite;'>FloralWhite</option>" +
    "<option style='font-weight: bold; background-color: #01030E !important; color: ForestGreen;'>ForestGreen</option>" +
    "<option style='font-weight: bold; background-color: #370537 !important; color: Fuchsia;'>Fuchsia</option>" +
    "<option style='font-weight: bold; background-color: #5F4C4C !important; color: Gainsboro;'>Gainsboro</option>" +
    "<option style='font-weight: bold; background-color: #615B69 !important; color: GhostWhite;'>GhostWhite</option>" +
    "<option style='font-weight: bold; background-color: #504930 !important; color: Gold;'>Gold</option>" +
    "<option style='font-weight: bold; background-color: #442E2C !important; color: GoldenRod;'>GoldenRod</option>" +
    "<option style='font-weight: bold; background-color: #020202 !important; color: Gray;'>Gray</option>" +
    "<option style='font-weight: bold; background-color: #BCE8D6 !important; color: Green;'>Green</option>" +
    "<option style='font-weight: bold; background-color: #275C69 !important; color: GreenYellow;'>GreenYellow</option>" +
    "<option style='font-weight: bold; background-color: #4C6269 !important; color: HoneyDew;'>HoneyDew</option>" +
    "<option style='font-weight: bold; background-color: #501130 !important; color: HotPink;'>HotPink</option>" +
    "<option style='font-weight: bold; background-color: #000402 !important; color: IndianRed;'>IndianRed</option>" +
    "<option style='font-weight: bold; background-color: #A3B0B6 !important; color: Indigo;'>Indigo</option>" +
    "<option style='font-weight: bold; background-color: #695D58 !important; color: Ivory;'>Ivory</option>" +
    "<option style='font-weight: bold; background-color: #5A5208 !important; color: Khaki;'>Khaki</option>" +
    "<option style='font-weight: bold; background-color: #5C5064 !important; color: Lavender;'>Lavender</option>" +
    "<option style='font-weight: bold; background-color: #825463 !important; color: LavenderBlush;'>LavenderBlush</option>" +
    "<option style='font-weight: bold; background-color: #4B4D4B !important; color: LawnGreen;'>LawnGreen</option>" +
    "<option style='font-weight: bold; background-color: #69605D !important; color: LemonChiffon;'>LemonChiffon</option>" +
    "<option style='font-weight: bold; background-color: #334850 !important; color: LightBlue;'>LightBlue</option>" +
    "<option style='font-weight: bold; background-color: #5A0C0C !important; color: LightCoral;'>LightCoral</option>" +
    "<option style='font-weight: bold; background-color: #5D5C69 !important; color: LightCyan;'>LightCyan</option>" +
    "<option style='font-weight: bold; background-color: #64605C !important; color: LightGoldenRodYellow;'>LightGoldenRodYellow</option>" +
    "<option style='font-weight: bold; background-color: #6F4343 !important; color: LightGray;'>LightGray</option>" +
    "<option style='font-weight: bold; background-color: #355158 !important; color: LightGreen;'>LightGreen</option>" +
    "<option style='font-weight: bold; background-color: #50404B !important; color: LightPink;'>LightPink</option>" +
    "<option style='font-weight: bold; background-color: #373430 !important; color: LightSalmon;'>LightSalmon</option>" +
    "<option style='font-weight: bold; background-color: #242B35 !important; color: LightSeaGreen;'>LightSeaGreen</option>" +
    "<option style='font-weight: bold; background-color: #034B3C !important; color: LightSkyBlue;'>LightSkyBlue</option>" +
    "<option style='font-weight: bold; background-color: #240535 !important; color: LightSlateGray;'>LightSlateGray</option>" +
    "<option style='font-weight: bold; background-color: #074845 !important; color: LightSteelBlue;'>LightSteelBlue</option>" +
    "<option style='font-weight: bold; background-color: #69605C !important; color: LightYellow;'>LightYellow</option>" +
    "<option style='font-weight: bold; background-color: #165869 !important; color: Lime;'>Lime</option>" +
    "<option style='font-weight: bold; background-color: #233237 !important; color: LimeGreen;'>LimeGreen</option>" +
    "<option style='font-weight: bold; background-color: #645A50 !important; color: Linen;'>Linen</option>" +
    "<option style='font-weight: bold; background-color: #370537 !important; color: Magenta;'>Magenta</option>" +
    "<option style='font-weight: bold; background-color: #CEB291 !important; color: Maroon;'>Maroon</option>" +
    "<option style='font-weight: bold; background-color: #2C3732 !important; color: MediumAquaMarine;'>MediumAquaMarine</option>" +
    "<option style='font-weight: bold; background-color: #CCA5E7 !important; color: MediumBlue;'>MediumBlue</option>" +
    "<option style='font-weight: bold; background-color: #160D3D !important; color: MediumOrchid;'>MediumOrchid</option>" +
    "<option style='font-weight: bold; background-color: #28012C !important; color: MediumPurple;'>MediumPurple</option>" +
    "<option style='font-weight: bold; background-color: #073336 !important; color: MediumSeaGreen;'>MediumSeaGreen</option>" +
    "<option style='font-weight: bold; background-color: #0B013F !important; color: MediumSlateBlue;'>MediumSlateBlue</option>" +
    "<option style='font-weight: bold; background-color: #644463 !important; color: MediumSpringGreen;'>MediumSpringGreen</option>" +
    "<option style='font-weight: bold; background-color: #2C3D54 !important; color: MediumTurquoise;'>MediumTurquoise</option>" +
    "<option style='font-weight: bold; background-color: #E3EDFB !important; color: MediumVioletRed;'>MediumVioletRed</option>" +
    "<option style='font-weight: bold; background-color: #A4859B !important; color: MidnightBlue;'>MidnightBlue</option>" +
    "<option style='font-weight: bold; background-color: #446469 !important; color: MintCream;'>MintCream</option>" +
    "<option style='font-weight: bold; background-color: #695450 !important; color: MistyRose;'>MistyRose</option>" +
    "<option style='font-weight: bold; background-color: #695454 !important; color: Moccasin;'>Moccasin</option>" +
    "<option style='font-weight: bold; background-color: #695454 !important; color: NavajoWhite;'>NavajoWhite</option>" +
    "<option style='font-weight: bold; background-color: #CE7EBE !important; color: Navy;'>Navy</option>" +
    "<option style='font-weight: bold; background-color: #675A48 !important; color: OldLace;'>OldLace</option>" +
    "<option style='font-weight: bold; background-color: #050535 !important; color: Olive;'>Olive</option>" +
    "<option style='font-weight: bold; background-color: #110D02 !important; color: OliveDrab;'>OliveDrab</option>" +
    "<option style='font-weight: bold; background-color: #373232 !important; color: Orange;'>Orange</option>" +
    "<option style='font-weight: bold; background-color: #370E00 !important; color: OrangeRed;'>OrangeRed</option>" +
    "<option style='font-weight: bold; background-color: #231E2B !important; color: Orchid;'>Orchid</option>" +
    "<option style='font-weight: bold; background-color: #585224 !important; color: PaleGoldenRod;'>PaleGoldenRod</option>" +
    "<option style='font-weight: bold; background-color: #596561 !important; color: PaleGreen;'>PaleGreen</option>" +
    "<option style='font-weight: bold; background-color: #0C5858 !important; color: PaleTurquoise;'>PaleTurquoise</option>" +
    "<option style='font-weight: bold; background-color: #450117 !important; color: PaleVioletRed;'>PaleVioletRed</option>" +
    "<option style='font-weight: bold; background-color: #825453 !important; color: PapayaWhip;'>PapayaWhip</option>" +
    "<option style='font-weight: bold; background-color: #504C49 !important; color: PeachPuff;'>PeachPuff</option>" +
    "<option style='font-weight: bold; background-color: #372516 !important; color: Peru;'>Peru</option>" +
    "<option style='font-weight: bold; background-color: #693A5C !important; color: Pink;'>Pink</option>" +
    "<option style='font-weight: bold; background-color: #3A3347 !important; color: Plum;'>Plum</option>" +
    "<option style='font-weight: bold; background-color: #4A5982 !important; color: PowderBlue;'>PowderBlue</option>" +
    "<option style='font-weight: bold; background-color: #BAC9CE !important; color: Purple;'>Purple</option>" +
    "<option style='font-weight: bold; background-color: #BDCDC8 !important; color: RebeccaPurple;'>RebeccaPurple</option>" +
    "<option style='font-weight: bold; background-color: #370000 !important; color: Red;'>Red</option>" +
    "<option style='font-weight: bold; background-color: #580505 !important; color: RosyBrown;'>RosyBrown</option>" +
    "<option style='font-weight: bold; background-color: #F2FBE2 !important; color: RoyalBlue;'>RoyalBlue</option>" +
    "<option style='font-weight: bold; background-color: #D9D1CB !important; color: SaddleBrown;'>SaddleBrown</option>" +
    "<option style='font-weight: bold; background-color: #642119 !important; color: Salmon;'>Salmon</option>" +
    "<option style='font-weight: bold; background-color: #45382F !important; color: SandyBrown;'>SandyBrown</option>" +
    "<option style='font-weight: bold; background-color: #010E27 !important; color: SeaGreen;'>SeaGreen</option>" +
    "<option style='font-weight: bold; background-color: #825E45 !important; color: SeaShell;'>SeaShell</option>" +
    "<option style='font-weight: bold; background-color: #E8EAEE !important; color: Sienna;'>Sienna</option>" +
    "<option style='font-weight: bold; background-color: #5C4A4A !important; color: Silver;'>Silver</option>" +
    "<option style='font-weight: bold; background-color: #1F4455 !important; color: SkyBlue;'>SkyBlue</option>" +
    "<option style='font-weight: bold; background-color: #FFF2CD !important; color: SlateBlue;'>SlateBlue</option>" +
    "<option style='font-weight: bold; background-color: #13102C !important; color: SlateGray;'>SlateGray</option>" +
    "<option style='font-weight: bold; background-color: #826464 !important; color: Snow;'>Snow</option>" +
    "<option style='font-weight: bold; background-color: #546469 !important; color: SpringGreen;'>SpringGreen</option>" +
    "<option style='font-weight: bold; background-color: #09141E !important; color: SteelBlue;'>SteelBlue</option>" +
    "<option style='font-weight: bold; background-color: #554737 !important; color: Tan;'>Tan</option>" +
    "<option style='font-weight: bold; background-color: #202835 !important; color: Teal;'>Teal</option>" +
    "<option style='font-weight: bold; background-color: #744256 !important; color: Thistle;'>Thistle</option>" +
    "<option style='font-weight: bold; background-color: #372C2A !important; color: Tomato;'>Tomato</option>" +
    "<option style='font-weight: bold; background-color: #2E557C !important; color: Turquoise;'>Turquoise</option>" +
    "<option style='font-weight: bold; background-color: #710F71 !important; color: Violet;'>Violet</option>" +
    "<option style='font-weight: bold; background-color: #785757 !important; color: Wheat;'>Wheat</option>" +
    "<option style='font-weight: bold; background-color: #827373 !important; color: White;'>White</option>" +
    "<option style='font-weight: bold; background-color: #786A6A !important; color: WhiteSmoke;'>WhiteSmoke</option>" +
    "<option style='font-weight: bold; background-color: #82695C !important; color: Yellow;'>Yellow</option>" +
    "<option style='font-weight: bold; background-color: #504C43 !important; color: YellowGreen;'>YellowGreen</option>" +
    "</select>" +
    "<br>All other colors must be specified using a hex value (ex: <span style='color:#FF0000;'>#FF0000</span>)<br>&ensp;";

  var bgColorOptions = "<hr><span style='font-weight:bold;'>Usage</span>: Enter a color name, hex, or select a color." +
    "<hr><span style='font-weight:bold;'>Valid Color Names</span>: " +
    "<select style='background-color: #eee; border:none; width: 125px; height: 14px; font-size: 12px; font-family: Arial;'>" +
    "<option>Background Colors</option>" +
    "<option style='font-weight: bold; color: #71706F !important; background-color: AliceBlue !important;'>AliceBlue</option>" +
    "<option style='font-weight: bold; color: #716363 !important; background-color: AntiqueWhite !important;'>AntiqueWhite</option>" +
    "<option style='font-weight: bold; color: #716363 !important; background-color: Aqua !important;'>Aqua</option>" +
    "<option style='font-weight: bold; color: #716363 !important; background-color: Aquamarine !important;'>Aquamarine</option>" +
    "<option style='font-weight: bold; color: #8A6C6C !important; background-color: Azure !important;'>Azure</option>" +
    "<option style='font-weight: bold; color: #716C6F !important; background-color: Beige !important;'>Beige</option>" +
    "<option style='font-weight: bold; color: #686964 !important; background-color: Bisque !important;'>Bisque</option>" +
    "<option style='font-weight: bold; color: #828282 !important; background-color: Black !important;'>Black</option>" +
    "<option style='font-weight: bold; color: #825A5A !important; background-color: BlanchedAlmond !important;'>BlanchedAlmond</option>" +
    "<option style='font-weight: bold; color: #E6E6D3 !important; background-color: Blue !important;'>Blue</option>" +
    "<option style='font-weight: bold; color: #E3E3E2 !important; background-color: BlueViolet !important;'>BlueViolet</option>" +
    "<option style='font-weight: bold; color: #D9D2D2 !important; background-color: Brown !important;'>Brown</option>" +
    "<option style='font-weight: bold; color: #483723 !important; background-color: BurlyWood !important;'>BurlyWood</option>" +
    "<option style='font-weight: bold; color: #201822 !important; background-color: CadetBlue !important;'>CadetBlue</option>" +
    "<option style='font-weight: bold; color: #465040 !important; background-color: Chartreuse !important;'>Chartreuse</option>" +
    "<option style='font-weight: bold; color: #080901 !important; background-color: Chocolate !important;'>Chocolate</option>" +
    "<option style='font-weight: bold; color: #372821 !important; background-color: Coral !important;'>Coral</option>" +
    "<option style='font-weight: bold; color: #241A20 !important; background-color: CornflowerBlue !important; '>CornflowerBlue</option>" +
    "<option style='font-weight: bold; color: #695C30 !important; background-color: Cornsilk !important;'>Cornsilk</option>" +
    "<option style='font-weight: bold; color: #F6F6F3 !important; background-color: Crimson !important;'>Crimson</option>" +
    "<option style='font-weight: bold; color: #4A5469 !important; background-color: Cyan !important;'>Cyan</option>" +
    "<option style='font-weight: bold; color: #95A5A2 !important; background-color: DarkBlue !important;'>DarkBlue</option>" +
    "<option style='font-weight: bold; color: #0B040E !important; background-color: DarkCyan !important;'>DarkCyan</option>" +
    "<option style='font-weight: bold; color: #211412 !important; background-color: DarkGoldenRod !important;'>DarkGoldenRod</option>" +
    "<option style='font-weight: bold; color: #2C2C2C !important; background-color: DarkGray !important;'>DarkGray</option>" +
    "<option style='font-weight: bold; color: #CCCCCC !important; background-color: DarkGreen !important;'>DarkGreen</option>" +
    "<option style='font-weight: bold; color: #403129 !important; background-color: DarkKhaki !important;'>DarkKhaki</option>" +
    "<option style='font-weight: bold; color: #C3D4D9 !important; background-color: DarkMagenta !important;'>DarkMagenta</option>" +
    "<option style='font-weight: bold; color: #DEE7ED !important; background-color: DarkOliveGreen !important;'>DarkOliveGreen</option>" +
    "<option style='font-weight: bold; color: #372C21 !important; background-color: DarkOrange !important;'>DarkOrange</option>" +
    "<option style='font-weight: bold; color: #E4E6D6 !important; background-color: DarkOrchid !important;'>DarkOrchid</option>" +
    "<option style='font-weight: bold; color: #BBBFAC !important; background-color: DarkRed !important;'>DarkRed</option>" +
    "<option style='font-weight: bold; color: #3A2923 !important; background-color: DarkSalmon !important;'>DarkSalmon</option>" +
    "<option style='font-weight: bold; color: #16353F !important; background-color: DarkSeaGreen !important;'>DarkSeaGreen</option>" +
    "<option style='font-weight: bold; color: #D9CBCB !important; background-color: DarkSlateBlue !important;'>DarkSlateBlue</option>" +
    "<option style='font-weight: bold; color: #D1D1D1 !important; background-color: DarkSlateGray !important;'>DarkSlateGray</option>" +
    "<option style='font-weight: bold; color: #1D393B !important; background-color: DarkTurquoise !important;'>DarkTurquoise</option>" +
    "<option style='font-weight: bold; color: #EBEDED !important; background-color: DarkViolet !important;'>DarkViolet</option>" +
    "<option style='font-weight: bold; color: #1B0E1E !important; background-color: DeepPink !important;'>DeepPink</option>" +
    "<option style='font-weight: bold; color: #053725 !important; background-color: DeepSkyBlue !important;'>DeepSkyBlue</option>" +
    "<option style='font-weight: bold; color: #EBEBEB !important; background-color: DimGray !important;'>DimGray</option>" +
    "<option style='font-weight: bold; color: #2A1237 !important; background-color: DodgerBlue !important;'>DodgerBlue</option>" +
    "<option style='font-weight: bold; color: #E0E6CE !important; background-color: FireBrick !important;'>FireBrick</option>" +
    "<option style='font-weight: bold; color: #69604C !important; background-color: FloralWhite !important;'>FloralWhite</option>" +
    "<option style='font-weight: bold; color: #01030E !important; background-color: ForestGreen !important;'>ForestGreen</option>" +
    "<option style='font-weight: bold; color: #370537 !important; background-color: Fuchsia !important;'>Fuchsia</option>" +
    "<option style='font-weight: bold; color: #5F4C4C !important; background-color: Gainsboro !important;'>Gainsboro</option>" +
    "<option style='font-weight: bold; color: #615B69 !important; background-color: GhostWhite !important;'>GhostWhite</option>" +
    "<option style='font-weight: bold; color: #504930 !important; background-color: Gold !important;'>Gold</option>" +
    "<option style='font-weight: bold; color: #442E2C !important; background-color: GoldenRod !important;'>GoldenRod</option>" +
    "<option style='font-weight: bold; color: #020202 !important; background-color: Gray !important;'>Gray</option>" +
    "<option style='font-weight: bold; color: #BCE8D6 !important; background-color: Green !important;'>Green</option>" +
    "<option style='font-weight: bold; color: #275C69 !important; background-color: GreenYellow !important;'>GreenYellow</option>" +
    "<option style='font-weight: bold; color: #4C6269 !important; background-color: HoneyDew !important;'>HoneyDew</option>" +
    "<option style='font-weight: bold; color: #501130 !important; background-color: HotPink !important;'>HotPink</option>" +
    "<option style='font-weight: bold; color: #000402 !important; background-color: IndianRed !important;'>IndianRed</option>" +
    "<option style='font-weight: bold; color: #A3B0B6 !important; background-color: Indigo !important;'>Indigo</option>" +
    "<option style='font-weight: bold; color: #695D58 !important; background-color: Ivory !important;'>Ivory</option>" +
    "<option style='font-weight: bold; color: #5A5208 !important; background-color: Khaki !important;'>Khaki</option>" +
    "<option style='font-weight: bold; color: #5C5064 !important; background-color: Lavender !important;'>Lavender</option>" +
    "<option style='font-weight: bold; color: #825463 !important; background-color: LavenderBlush !important;'>LavenderBlush</option>" +
    "<option style='font-weight: bold; color: #4B4D4B !important; background-color: LawnGreen !important;'>LawnGreen</option>" +
    "<option style='font-weight: bold; color: #69605D !important; background-color: LemonChiffon !important;'>LemonChiffon</option>" +
    "<option style='font-weight: bold; color: #334850 !important; background-color: LightBlue !important;'>LightBlue</option>" +
    "<option style='font-weight: bold; color: #5A0C0C !important; background-color: LightCoral !important;'>LightCoral</option>" +
    "<option style='font-weight: bold; color: #5D5C69 !important; background-color: LightCyan !important;'>LightCyan</option>" +
    "<option style='font-weight: bold; color: #64605C !important; background-color: LightGoldenRodYellow !important;'>LightGoldenRodYellow</option>" +
    "<option style='font-weight: bold; color: #6F4343 !important; background-color: LightGray !important;'>LightGray</option>" +
    "<option style='font-weight: bold; color: #355158 !important; background-color: LightGreen !important;'>LightGreen</option>" +
    "<option style='font-weight: bold; color: #50404B !important; background-color: LightPink !important;'>LightPink</option>" +
    "<option style='font-weight: bold; color: #373430 !important; background-color: LightSalmon !important;'>LightSalmon</option>" +
    "<option style='font-weight: bold; color: #242B35 !important; background-color: LightSeaGreen !important;'>LightSeaGreen</option>" +
    "<option style='font-weight: bold; color: #034B3C !important; background-color: LightSkyBlue !important;'>LightSkyBlue</option>" +
    "<option style='font-weight: bold; color: #240535 !important; background-color: LightSlateGray !important;'>LightSlateGray</option>" +
    "<option style='font-weight: bold; color: #074845 !important; background-color: LightSteelBlue !important;'>LightSteelBlue</option>" +
    "<option style='font-weight: bold; color: #69605C !important; background-color: LightYellow !important;'>LightYellow</option>" +
    "<option style='font-weight: bold; color: #165869 !important; background-color: Lime !important;'>Lime</option>" +
    "<option style='font-weight: bold; color: #233237 !important; background-color: LimeGreen !important;'>LimeGreen</option>" +
    "<option style='font-weight: bold; color: #645A50 !important; background-color: Linen !important;'>Linen</option>" +
    "<option style='font-weight: bold; color: #370537 !important; background-color: Magenta !important;'>Magenta</option>" +
    "<option style='font-weight: bold; color: #CEB291 !important; background-color: Maroon !important;'>Maroon</option>" +
    "<option style='font-weight: bold; color: #2C3732 !important; background-color: MediumAquaMarine !important;'>MediumAquaMarine</option>" +
    "<option style='font-weight: bold; color: #CCA5E7 !important; background-color: MediumBlue !important;'>MediumBlue</option>" +
    "<option style='font-weight: bold; color: #160D3D !important; background-color: MediumOrchid !important;'>MediumOrchid</option>" +
    "<option style='font-weight: bold; color: #28012C !important; background-color: MediumPurple !important;'>MediumPurple</option>" +
    "<option style='font-weight: bold; color: #073336 !important; background-color: MediumSeaGreen !important;'>MediumSeaGreen</option>" +
    "<option style='font-weight: bold; color: #0B013F !important; background-color: MediumSlateBlue !important;'>MediumSlateBlue</option>" +
    "<option style='font-weight: bold; color: #644463 !important; background-color: MediumSpringGreen !important;'>MediumSpringGreen</option>" +
    "<option style='font-weight: bold; color: #2C3D54 !important; background-color: MediumTurquoise !important;'>MediumTurquoise</option>" +
    "<option style='font-weight: bold; color: #E3EDFB !important; background-color: MediumVioletRed !important;'>MediumVioletRed</option>" +
    "<option style='font-weight: bold; color: #A4859B !important; background-color: MidnightBlue !important;'>MidnightBlue</option>" +
    "<option style='font-weight: bold; color: #446469 !important; background-color: MintCream !important;'>MintCream</option>" +
    "<option style='font-weight: bold; color: #695450 !important; background-color: MistyRose !important;'>MistyRose</option>" +
    "<option style='font-weight: bold; color: #695454 !important; background-color: Moccasin !important;'>Moccasin</option>" +
    "<option style='font-weight: bold; color: #695454 !important; background-color: NavajoWhite !important;'>NavajoWhite</option>" +
    "<option style='font-weight: bold; color: #CE7EBE !important; background-color: Navy !important;'>Navy</option>" +
    "<option style='font-weight: bold; color: #675A48 !important; background-color: OldLace !important;'>OldLace</option>" +
    "<option style='font-weight: bold; color: #050535 !important; background-color: Olive !important;'>Olive</option>" +
    "<option style='font-weight: bold; color: #110D02 !important; background-color: OliveDrab !important;'>OliveDrab</option>" +
    "<option style='font-weight: bold; color: #373232 !important; background-color: Orange !important;'>Orange</option>" +
    "<option style='font-weight: bold; color: #370E00 !important; background-color: OrangeRed !important;'>OrangeRed</option>" +
    "<option style='font-weight: bold; color: #231E2B !important; background-color: Orchid !important;'>Orchid</option>" +
    "<option style='font-weight: bold; color: #585224 !important; background-color: PaleGoldenRod !important;'>PaleGoldenRod</option>" +
    "<option style='font-weight: bold; color: #596561 !important; background-color: PaleGreen !important;'>PaleGreen</option>" +
    "<option style='font-weight: bold; color: #0C5858 !important; background-color: PaleTurquoise !important;'>PaleTurquoise</option>" +
    "<option style='font-weight: bold; color: #450117 !important; background-color: PaleVioletRed !important;'>PaleVioletRed</option>" +
    "<option style='font-weight: bold; color: #825453 !important; background-color: PapayaWhip !important;'>PapayaWhip</option>" +
    "<option style='font-weight: bold; color: #504C49 !important; background-color: PeachPuff !important;'>PeachPuff</option>" +
    "<option style='font-weight: bold; color: #372516 !important; background-color: Peru !important;'>Peru</option>" +
    "<option style='font-weight: bold; color: #693A5C !important; background-color: Pink !important;'>Pink</option>" +
    "<option style='font-weight: bold; color: #3A3347 !important; background-color: Plum !important;'>Plum</option>" +
    "<option style='font-weight: bold; color: #4A5982 !important; background-color: PowderBlue !important;'>PowderBlue</option>" +
    "<option style='font-weight: bold; color: #BAC9CE !important; background-color: Purple !important;'>Purple</option>" +
    "<option style='font-weight: bold; color: #BDCDC8 !important; background-color: RebeccaPurple !important;'>RebeccaPurple</option>" +
    "<option style='font-weight: bold; color: #370000 !important; background-color: Red !important;'>Red</option>" +
    "<option style='font-weight: bold; color: #580505 !important; background-color: RosyBrown !important;'>RosyBrown</option>" +
    "<option style='font-weight: bold; color: #F2FBE2 !important; background-color: RoyalBlue !important;'>RoyalBlue</option>" +
    "<option style='font-weight: bold; color: #D9D1CB !important; background-color: SaddleBrown !important;'>SaddleBrown</option>" +
    "<option style='font-weight: bold; color: #642119 !important; background-color: Salmon !important;'>Salmon</option>" +
    "<option style='font-weight: bold; color: #45382F !important; background-color: SandyBrown !important;'>SandyBrown</option>" +
    "<option style='font-weight: bold; color: #010E27 !important; background-color: SeaGreen !important;'>SeaGreen</option>" +
    "<option style='font-weight: bold; color: #825E45 !important; background-color: SeaShell !important;'>SeaShell</option>" +
    "<option style='font-weight: bold; color: #E8EAEE !important; background-color: Sienna !important;'>Sienna</option>" +
    "<option style='font-weight: bold; color: #5C4A4A !important; background-color: Silver !important;'>Silver</option>" +
    "<option style='font-weight: bold; color: #1F4455 !important; background-color: SkyBlue !important;'>SkyBlue</option>" +
    "<option style='font-weight: bold; color: #FFF2CD !important; background-color: SlateBlue !important;'>SlateBlue</option>" +
    "<option style='font-weight: bold; color: #13102C !important; background-color: SlateGray !important;'>SlateGray</option>" +
    "<option style='font-weight: bold; color: #826464 !important; background-color: Snow !important;'>Snow</option>" +
    "<option style='font-weight: bold; color: #546469 !important; background-color: SpringGreen !important;'>SpringGreen</option>" +
    "<option style='font-weight: bold; color: #09141E !important; background-color: SteelBlue !important;'>SteelBlue</option>" +
    "<option style='font-weight: bold; color: #554737 !important; background-color: Tan !important;'>Tan</option>" +
    "<option style='font-weight: bold; color: #202835 !important; background-color: Teal !important;'>Teal</option>" +
    "<option style='font-weight: bold; color: #744256 !important; background-color: Thistle !important;'>Thistle</option>" +
    "<option style='font-weight: bold; color: #372C2A !important; background-color: Tomato !important;'>Tomato</option>" +
    "<option style='font-weight: bold; color: #2E557C !important; background-color: Turquoise !important;'>Turquoise</option>" +
    "<option style='font-weight: bold; color: #710F71 !important; background-color: Violet !important;'>Violet</option>" +
    "<option style='font-weight: bold; color: #785757 !important; background-color: Wheat !important;'>Wheat</option>" +
    "<option style='font-weight: bold; color: #827373 !important; background-color: White !important;'>White</option>" +
    "<option style='font-weight: bold; color: #786A6A !important; background-color: WhiteSmoke !important;'>WhiteSmoke</option>" +
    "<option style='font-weight: bold; color: #82695C !important; background-color: Yellow !important;'>Yellow</option>" +
    "<option style='font-weight: bold; color: #504C43 !important; background-color: YellowGreen !important;'>YellowGreen</option>" +
    "</select>" +
    "<br>All other colors must be specified using a hex value (ex: <span style='color:#FF0000;'>#FF0000</span>)<br>&ensp;";
  // ------------------
  // Default Value:
  var helpString = "<hr><b title='The default value(s) of this property.'>Default Value:</b> ";
  // <c>value</c>
  helpString += codeOpen;
  if (defVal === "true") {
    helpString += trueSpan;
  } else if (defVal === "blank") {
    helpString += blankSpan;
  } else if (defVal === "css") {
    helpString += cssSpan;
  } else if (defVal === "false") {
    helpString += falseSpan;
  } else if (defVal === "placeholder") {
    helpString += placeholderSpan;
  } else if (defVal === "browser") {
    helpString += browserSpan;
  } else if (defVal === "theme") {
    helpString += themeSpan;
  } else if (defVal === "skin") {
    helpString += skinSpan;
  } else if (defVal === "id") {
    helpString += idSpan;
  } else if (defVal === "bind") {
    helpString += bindSpan;
  } else if (defVal === "widget") {
    helpString += widgetSpan;
  } else if (defVal === "position") {
    helpString += positionSpan;
  } else {
    helpString += defVal;
  }
  helpString += codeClose;
  // ------------------
  // Description:
  helpString += "<hr><b title='A general description of the widget's properties.'>Description: </b>";
  // Description text...
  helpString += descVal;

  if (descAdd != null){
    // Other...
    if (descAdd.indexOf("other") != -1) {
      helpString += otherText;
    }
    // Color Examples:
    if (descAdd.indexOf("color") != -1) {
      helpString += colorOptions;
    }
    // Background Color Examples:
    if (descAdd.indexOf("background color") != -1) {
      helpString += bgColorOptions;
    }
    // Font Family Examples:
    if (descAdd.indexOf("font") != -1) {
      helpString += fontOptions;
    }
    // Font Family Examples:
    if (descAdd.indexOf("overflow") != -1) {
      helpString += overflowOptions;
    }
    // Font Family Examples:
    if (descAdd.indexOf("pixel") != -1) {
      helpString += pixelText;
    }
  }
  // Note: Text...
  if (typeof noteVal == 'string' && noteVal.length > 0) {
    helpString += "<br><br><b style='color: red;'>Note: </b>" + noteVal;
  }
  // ------------------
  helpString += "<hr><br>";

  return helpString;
};

// Provides list of properties and their definitions
function getPropertiesModel() {
  if (cachedPropertiesModel != null) return cachedPropertiesModel;

  if (pui.codeBased) {
    cachedPropertiesModel = [
      { name: "Identification",  category: true }, 
      { name: "bound field", help: pui.helpTextProperties("Field[<span title='A whole number value starting from 0001 determined by how many fields with unchanged names have previously been added to the Universal Display File.'>number</span>]", "Use this property to specify the bound field name and data type."), readOnly: true, canBeRemoved: false }, 
      { name: "description", help: pui.helpTextProperties("blank", "Use this property to provide a text description (or comment) for the field."), bind: false }, 
      
      { name: "Misc", category: true }, 
      { name: "encoding", choices: ["none", "html", "json", "xml", "csv"], help: pui.helpTextProperties("[<span title='The Format Property *document type* of the Record Format.'>document type</span>]", "Sets the encoding type for the field. If not set, the encoding will default based on the <i>document type</i> property setting."), bind: false }, 
      { name: "visibility", format: "1 / 0", readOnly: true, hideFormatting: true, validDataTypes: ["indicator", "expression"], help: pui.helpTextProperties("true", "Determines whether the field is output or not.") }, 
      { name: "user defined data", multOccur: true, help: pui.helpTextProperties("blank", "Specifies user-defined general purpose data associated with the field. To provide multiple user defined data values, right-click the property and select Add Another User Defined Value.") }
    ];
    return cachedPropertiesModel;
  }

  var borderStyles = ["none", "dotted", "dashed", "solid", "double", "groove", "ridge", "inset", "outset"];
  var borderWidths = ["thin", "medium", "thick", "0px", "1px", "2px", "3px", "4px", "5px", "Other..."];
  var paddings = ["auto", "0px", "1px", "2px", "3px", "4px", "5px", "6px", "7px", "8px", "9px", "Other..."];

  cachedPropertiesModel = [
    { name: "Identification", category: true },
    { name: "id", attribute: "id", maxLength: 75, help: pui.helpTextProperties("id", "Specifies the ID of the current element. ID's are used to access the element using CSS (#element-id { ... }) and JavaScript code (getObj(\"element-id\");)."), bind: false, canBeRemoved: false },
    { name: "parent window", attribute: "parentWindow", help: pui.helpTextProperties("blank", "Specifies the window that this field belongs to."), context: "genie" },
    { name: "screen identifier", choices: ["true", "false"], blankChoice: false, help: pui.helpTextProperties("false", "If set to true, this element will be used to <u>detect the screen</u>. This means that any screen with an elment matching this one will receive the screen customizations that were saved to the .scn file. Because of this, the identifier element is suggested to be a <i>unique and static output field</i> of the screen(s) you would like the changes to apply to. For example, if the screen has a unique heading, it can be used as an identifier for the screen. When appropriate, you can use a combination of several elements to uniquely identify the screen.", null, "At least one element on the screen must be marked as an identifier before you can save the screen."), context: "genie" },
    { name: "field type", displayName: "widget type", choices: pui.widgets.getWidgetList(false), blankChoice: false, help: pui.helpTextProperties("widget", "Specifies the type of control that is used to render the element."), bind: false, canBeRemoved: false },
    { name: "description", help: pui.helpTextProperties("blank", "This property is used to provide a text description or comment for the element."), bind: false }, 
    { name: "button style", choices: pui.widgets.getButtonStyles, help: pui.helpTextProperties("theme", "Specifies the style to be used for the look and feel of the button."), controls: ["styled button"] }, 
    { name: "panel style", choices: pui.widgets.getPanelStyles, help: pui.helpTextProperties("theme", "Specifies the style to be used for the look and feel of the panel."), controls: ["panel"] }, 
    { name: "value", help: pui.helpTextProperties("theme", "Sets the initial value of the current element."), translate: true }, 
    { name: "response", format: "1 / 0", readOnly: true, hideFormatting: true, validDataTypes: ["indicator", "char", "zoned"], help: pui.helpTextProperties("bind", "Specifies a response indicator to be returned to your program when the element is clicked."), controls: ["button", "styled button", "graphic button", "hyperlink", "image", "css button", "icon"], context: "dspf" },
    { name: "menu response", readOnly: true, hideFormatting: true, help: pui.helpTextProperties("bind", "Specifies a response field to be returned to your program containing the value of the selected menu option. The menu option values are set with the 'choice values' property."), controls: ["menu"], context: "dspf" },
    { name: "tab response", readOnly: true, format: "number", hideFormatting: true, validDataTypes: ["zoned"], help: pui.helpTextProperties("bind", "Specifies a numeric response field to be returned to your program when a tab is selected containing the index of the selected tab. Each of the Tab Panel's tabs are identified by a sequential index, starting from 0. For example, 0 refers to the first tab, 1 refers to the second tab, etc."), controls: ["tab panel"], context: "dspf" },
    { name: "upload response", readOnly: true, hideFormatting: true, validDataTypes: ["char"], help: pui.helpTextProperties("bind", "Specifies a data structure response field to be returned to your program when files are uploaded populated with the number of files uploaded, the directory the files were uploaded to, and the names of each of the uploaded files. The data structure should be defined as follows (**FREE):<br>" + "<code class='propdefault'>" +  "&nbsp;&nbsp;DCL-DS UPLOADINFO QUALIFIED;<br>" + "&nbsp;&nbsp;&nbsp;&nbsp;NUMFILES  ZONED(3:0);<br>" + "&nbsp;&nbsp;&nbsp;&nbsp;DIRECTORY CHAR(256);<br>" + "&nbsp;&nbsp;&nbsp;&nbsp;FILES     CHAR(256) DIM(6);<br>" + "&nbsp;&nbsp;END-DS UPLOADINFO;" + "</code>"), controls: ["file upload", "file upload dnd"], context: "dspf" },
    { name: "radio button group", readOnly: true, help: pui.helpTextProperties("bind", "Specifies a response field to be returned to your program that allows you to associate multiple radio buttons together. The field name should be unique."), controls: ["radio button"], context: "dspf" }, 
    { name: "chart response", readOnly: true, hideFormatting: true, validDataTypes: ["char", "varchar", "string"], help: pui.helpTextProperties("bind", "Specifies a response field to be returned to your program containing the name of the data point selected by the user."), controls: ["chart"], context: "dspf" },
    { name: "Alternate Destination", category: true, controls: ["button", "styled button", "graphic button", "hyperlink", "image", "css button"], context: "dspf", viewdesigner: true }, 
    { name: "destination url", hideFormatting: true, validDataTypes: ["char", "varchar", "string"], help: pui.helpTextProperties("blank", "Specifies an alternate destination URL for the control. The screen will either be submitted to this URL or the browser will navigate to it, depending on the 'redirect to destination' property value."), controls: ["button", "styled button", "graphic button", "hyperlink", "image", "css button"], context: "dspf", viewdesigner: true }, 
    { name: "destination parameters", type: "destinationparams", readOnly: true, bind: false, help: pui.helpTextProperties("blank", "Identifies parameter names and the corresponding bound fields for use with 'destination url'."), relatedProperties: ["destination parameter name", "destination parameter value"], canBeRemoved: false, controls: ["button", "styled button", "graphic button", "hyperlink", "image", "css button"], context: "dspf", viewdesigner: true },
    { name: "destination parameter name", label: "Parameter Name", multOccur: true, hide: true, bind: false, help: "", controls: ["button", "styled button", "graphic button", "hyperlink", "image", "css button"], context: "dspf", viewdesigner: true },
    { name: "destination parameter value", label: "Parameter Value", multOccur: true, hide: true, help: "", controls: ["button", "styled button", "graphic button", "hyperlink", "image", "css button"], context: "dspf", viewdesigner: true },
    { name: "bookmarkable", choices: ["true", "false"], type: "boolean", hideFormatting: true, validDataTypes: ["indicator", "expression"], help: pui.helpTextProperties("true", "By default, 'destination parameters' are added to the URL to facilitate bookmarking. If this property is set to 'false', then the parameters will only appear in the POST data."), controls: ["button", "styled button", "graphic button", "hyperlink", "image", "css button"], context: "dspf", viewdesigner: true },
    { name: "redirect to destination", choices: ["true", "false"], type: "boolean", hideFormatting: true, validDataTypes: ["indicator", "expression"], help: pui.helpTextProperties("false", "If set to 'true' the browser will navigate to the 'destination url', passing the 'destination parameters'. Otherwise, the screen will submit by Ajax call."), controls: ["button", "styled button", "graphic button", "hyperlink", "image", "css button"], context: "dspf", viewdesigner: true },
    
    { name: "Font and Text", category: true }, 
    { name: "color", stylename: "color", type: "color", help: pui.helpTextProperties("css", "Specifies the color of the text inside the current element.", ["color"]), formattingProp: true },
    { name: "font family", stylename: "fontFamily", choices: ["Arial", "Consolas", "Courier New", "Georgia", "Monospace", "Tahoma", "Times New Roman", "Sans-Serif", "Serif", "Trebuchet MS", "Verdana", "Other..."], help: pui.helpTextProperties("css", "Specifies the font face for the text of the current element.", ["font", "other"]), formattingProp: true },
    { name: "font size", stylename: "fontSize", format: "px", choices: ["8px", "9px", "10px", "11px", "12px", "13px", "14px", "15px", "16px", "17px", "18px", "19px", "20px", "21px", "22px", "23px", "24px", "25px", "26px", "27px", "28px", "29px", "30px", "0.75em", "1.00em", "1.25em", "1.50em", "1.75em", "2.00em", "Other..."], help: pui.helpTextProperties("css", "Specifies the size of the text for the current element.<br><b>Examples:</b> <span style='font-size:12px;'>12px</span> <span style='font-size:2em;'>2em</span> <span style='font-size:1vh;'>1vh</span> <span style='font-size:12pt;'>12pt</span> <span style='font-size:70%;'>70%</span><br><br>", ["other"], "1em = 12pt = 16px = 100%"), formattingProp: true },
    { name: "font style", stylename: "fontStyle", format: "italic / normal", choices: ["normal", "italic", "oblique"], help: pui.helpTextProperties("css", "Specifies the style of the font inside the current element. <br><b>Examples:</b>" +  "<p style=''>Normal Text</p>" +  "<p style='font-style:italic;'>Italic Text</p>" +  "<span style='font-style:oblique;'>Oblique Text</span>", null, "The 'oblique' and 'italic' options will look the same for most fonts."), formattingProp: true },
    { name: "font variant", stylename: "fontVariant", choices: ["normal", "small-caps"], help: pui.helpTextProperties("css", "Specifies the font variant of the text inside the current element. <span style='font-variant:small-caps;'>'small caps' displays the text as capital letters with the same height of a lower case letter.</span>"), formattingProp: true },
    { name: "font weight", stylename: "fontWeight", format: "bold / normal", choices: ["normal", "bolder", "bold", "lighter", "100", "200", "300", "400", "500", "600", "700", "800", "900"], help: pui.helpTextProperties("css", "Specifies the weight of the text inside the current element. <br><b>Examples:</b>" + "<p style='font-weight: normal'>Font Weight: Normal</p>" + "<p style='font-weight: bolder'>Font Weight: Bolder</p>" + "<p style='font-weight: bold'>Font Weight: Bold</p>" + "<p style='font-weight: lighter'>Font Weight: Lighter</p>" + "<p style='font-weight: 100'>Font Weight 100</p>" + "<p style='font-weight: 200'>Font Weight 200</p>" + "<p style='font-weight: 300'>Font Weight 300</p>" + "<p style='font-weight: 400'>Font Weight 400</p>" + "<p style='font-weight: 500'>Font Weight 500</p>" + "<p style='font-weight: 600'>Font Weight 600</p>" + "<p style='font-weight: 700'>Font Weight 700</p>" + "<p style='font-weight: 800'>Font Weight 800</p>" + "<span style='font-weight: 900'>Font Weight 900</span>", null, "Not all fonts will display a difference between font weights."), formattingProp: true },
    { name: "letter spacing", stylename: "letterSpacing", format: "px", choices: ["normal", "-3px", "-2px", "-1px", "0px", "1px", "2px", "3px", "4px", "5px", "6px", "7px", "8px", "9px", "10px", "11px", "12px", "13px", "14px", "15px", "16px", "17px", "18px", "19px", "20px", "Other..."], formattingProp: true, help: pui.helpTextProperties("css", "Specifies the spacing between each letter of a word inside the current element. <b>Examples:</b> <p style='letter-spacing:4px;'>4px: Positive values increase the distance between letters.</p><p style='letter-spacing:-1px;'>-1px: Negative values decrease the distance between letters.</p><br>", ["other"]) },
    { name: "text align", stylename: "textAlign", choices: ["left", "right", "center", "justify"], help: pui.helpTextProperties("css", "Specifies the alignment of the text inside the current element.<br><b>Examples:</b> <table style='width:100%;' cellpadding='0' cellspacing='2'><tr><td><div style='text-align:left;width:100%;border:1px solid black;'>This text is aligned left.</div></td></tr><tr><td><div style='text-align:right;width:100%;border:1px solid black;'>This text is aligned right.</div></td></tr><tr><td><div style='text-align:center;width:100%;border:1px solid black;'>This text is aligned center.</div></td></tr><tr><td><div style='text-align:justify; text-align-last:justify; width:100%;border:1px solid black;'>This text has justified alignment.</div></td></tr></table>", null, "The CSS property 'text-align-last' can be used to set the alignment of the final line of a group of text."), formattingProp: true },
    { name: "text decoration", stylename: "textDecoration", format: "underline / none", choices: ["none", "underline", "overline", "line-through"], help: pui.helpTextProperties("none", "Specifies the decoration on the text inside the current element. <br><b>Examples:</b><br>None, <span style='text-decoration:underline;'>Underline</span>, <span style='text-decoration:overline;'>Overline</span>, <span style='text-decoration:line-through;'>Line-through</span>."), formattingProp: true },
    { name: "text transform", stylename: "textTransform", choices: ["capitalize", "uppercase", "lowercase", "none"], help: pui.helpTextProperties("none", "Specifies the transformation used as the default formatting of the text inside the current element. </br><b>Examples:</b> <br><br>capitalize: Changes The First Character Of Each Word To Uppercase<br><br>uppercase: CHANGES ALL CHARACTERS OF EACH WORD TO UPPERCASE<br><br>lowercase: changes all characters of each word to lowercase", null, "This only affects how the information is <i>displayed</i> in the browser. To send <u>transformed values</u> to your backend program, you must also <u>set</u> the <i>Text Transform</i> attribute of the <b>Binding Dialog</b> for the value being returned to the program. ") },
    { name: "white space", stylename: "whiteSpace", choices: ["normal", "pre", "nowrap", "pre-wrap", "pre-line"], help: pui.helpTextProperties("widget", "Specifies how white space inside the current element is handled. The default is <i>nowrap</i> for most widgets. The prefix 'pre-' is short for 'preserve'. ", null, "If 'pre', 'pre-wrap', or 'pre-line' aren't used, all white space is 'collapsed', meaning it doesn't display."), controls: ["html container", "hyperlink"] },
    { name: "word spacing", stylename: "wordSpacing", format: "px", choices: ["normal", "-3px", "-2px", "-1px", "0px", "1px", "2px", "3px", "4px", "5px", "6px", "7px", "8px", "9px", "10px", "11px", "12px", "13px", "14px", "15px", "16px", "17px", "18px", "19px", "20px", "21px", "22px", "23px", "24px", "25px", "Other..."], help: pui.helpTextProperties("css", "Specifies the spacing between each word inside the current element. <b>Examples:</b><span style='word-spacing:-2px;'>-2px: Negative values decrease the spacing between words.</span><br><span style='word-spacing:2px;'>2px: Positive values increase the spacing between words.</span>.", ["other"]), formattingProp: true },
    { name: "spell check", attribute: "spellcheck", choices: ["true", "false"], help: pui.helpTextProperties("browser", "Specifies whether the element will use the browser based spell checking. The default behavior is determined by the user's browser settings."), hideFormatting: true, validDataTypes: ["indicator"], controls: ["textbox", "text area"] },

    { name: "Field Settings", category: true },
    { name: "ajax url", type: "long", help: pui.helpTextProperties("blank", "Specifies the content url for an ajax container."), controls: ["ajax container"] },
    { name: "results template", type: "long", allowNewLines: true, controls: ["textbox"], help: pui.helpTextProperties("[default template]", "HTML template for auto-complete results panel. If omitted, a default template will be used.") },
    { name: "iframe url", type: "long", help: pui.helpTextProperties("blank", "Specifies the content url for an IFrame (inline frame) element."), controls: ["iframe"] },
    { name: "frame border", choices: ["true", "false"], blankChoice: false, help: pui.helpTextProperties("true", "Determines whether the IFrame (inline frame) element will have a border."), controls: ["iframe"] },
    { name: "theme", choices: ["A - Black", "B - Blue", "C - Gray", "D - Light Gray", "E - Yellow", "F - Green", "G - Red", "Other..."], help: pui.helpTextProperties("theme", "Specifies the jQuery Mobile theme to use for the button. The theme is associated with a set of cascading style sheet rules.", ["other"]), controls: ["css button"] },
    { name: "has header", choices: ["true", "false"], help: pui.helpTextProperties("theme", "Determines whether the panel has a header."), controls: ["css panel", "layout"] },
    { name: "header height", format: "number", help: pui.helpTextProperties("theme", "Specifies the height of the panel header."), controls: ["css panel", "layout"] },
    { name: "header theme", choices: ["A - Black", "B - Blue", "C - Gray", "D - Light Gray", "E - Yellow", "F - Green", "G - Red", "Other..."], help: pui.helpTextProperties("theme", "Specifies the jQuery Mobile theme to use for the panel header. The theme is associated with a set of cascading style sheet rules.", ["other"]), controls: ["css panel", "layout"] },
    { name: "body theme", choices: ["A - Black", "B - Blue", "C - Gray", "D - Light Gray", "E - Yellow", "F - Green", "G - Red", "Other..."], help: pui.helpTextProperties("theme", "Specifies the jQuery Mobile theme to use for the panel body. The theme is associated with a set of cascading style sheet rules.", ["other"]), controls: ["css panel", "layout"] },
    { name: "icon position", choices: ["left", "right"], help: pui.helpTextProperties("theme", "Specifies the position of the icon. If a position is not provided, icons other than image icons will not be displayed."), controls: ["css button", "graphic button"] },
    { name: "icon", type: "icon", help: pui.helpTextProperties("theme", "Identifies the icon to display in the position specified by the 'icon position' property. Setting this property overrides the 'image source' property.", null, "Material Icon set does not display in Internet Explorer 9 and lower."), controls: ["css button", "graphic button", "icon"] },
    { name: "small button", choices: ["true", "false"], help: pui.helpTextProperties("theme", "This property uses CSS to provide a smaller, more compact version of the button that is useful in toolbars and tight spaces."), controls: ["css button"] },
    { name: "straight edge", choices: ["all", "left", "right", "top", "bottom"], help: pui.helpTextProperties("theme", "Determines which parts of the element will have a straight edge instead of rounded corners."), controls: ["css button", "css panel", "layout"] },
    { name: "hyperlink reference", help: pui.helpTextProperties("browser", "This property specifies an href attribute for the hyperlink. It is used as an alternative to the response property or the onclick event property."), controls: ["hyperlink", "css button"] },
    { name: "target", help: pui.helpTextProperties("_self", "This property specifies where to open the hyperlink reference."), choices: ["_parent", "_blank", "_top", "_self"], controls: ["hyperlink", "css button"] },
    { name: "checked value", help: pui.helpTextProperties("blank", "For a checkbox field, specifies the value to send to the application when the checkbox is checked."), controls: ["checkbox"], bind: false },
    { name: "unchecked value", help: pui.helpTextProperties("blank", "For a checkbox field, specifies the value to send to the application when the checkbox is not checked."), controls: ["checkbox"], bind: false },
    { name: "on value", help: pui.helpTextProperties("blank", "Specifies the value to send to the application when the on/off switch is on."), controls: ["on off switch"], bind: false },
    { name: "off value", help: pui.helpTextProperties("blank", "Specifies the value to send to the application when the on/off switch is off."), controls: ["on off switch"], bind: false },
    { name: "on text", help: pui.helpTextProperties("ON", "Specifies the text to to display for the 'on' state of an on/off switch."), controls: ["on off switch"], translate: true },
    { name: "off text", help: pui.helpTextProperties("OFF", "Specifies the text to to display for the 'off' state of an on/off switch."), controls: ["on off switch"], translate: true },
    { name: "wide handle", choices: ["true", "false"], type: "boolean", help: pui.helpTextProperties("true", "Specifies whether the on/off switch should display a wide handle for switching state. If false is selected, a narrow handle will be used."), hideFormatting: true, validDataTypes: ["indicator", "expression"], controls: ["on off switch"] },
    { name: "date format", choices: ["MM/DD/YY", "MM/DD/YYYY", "DD/MM/YY", "DD/MM/YYYY", "DD.MM.YY", "DD.MM.YYYY", "MMDDYY", "MMDDYYYY", "DDMMYY", "DDMMYYYY", "YYMMDD", "YY/MM/DD", "YYYYMMDD", "YYYY-MM-DD", "YYYY/MM/DD"], help: pui.helpTextProperties("MM/DD/YY", "Defines the date format that is returned from the pop-up calendar."), controls: ["date field"], context: "genie" },
    { name: "default value", help: pui.helpTextProperties("blank", "Specifies a default value for a field. The specified value is displayed on the first output operation. On subsequent output operations, the program value appears."), controls: ["combo box", "date field", "output field", "password field", "select box", "spinner", "text area", "textbox"], bind: false, context: "dspf", viewdesigner: false },
    { name: "default value condition", validDataTypes: ["indicator", "expression"], hideFormatting: true, readOnly: true, format: "true / false", type: "boolean", help: pui.helpTextProperties("bind", "Determines if the default value is applied."), controls: ["combo box", "date field", "output field", "password field", "select box", "spinner", "text area", "textbox"], context: "dspf", viewdesigner: false },
    { name: "blank value", multOccur: true, help: pui.helpTextProperties("blank", "Use this property to map blank field data to a different value during input and output operations. This property is typically used with elements whose value is bound to a date, time, or timestamp field. To specify multiple blank values, right-click the property and select Add Another Blank Value."), controls: ["combo box", "date field", "output field", "password field", "spinner", "text area", "textbox"], bind: false, context: "dspf" },
    { name: "override data", choices: ["true", "false"], type: "boolean", help: pui.helpTextProperties("false", "Use this property to together with the 'put override' property to override existing data contents already on the display. It represents the OVRDTA keyword."), hideFormatting: true, validDataTypes: ["indicator", "expression"], controls: ["combo box", "date field", "output field", "password field", "select box", "spinner", "text area", "textbox"], context: "dspf", viewdesigner: false },
    { name: "override attribute", choices: ["true", "false"], type: "boolean", help: pui.helpTextProperties("false", "Use this property to together with the 'put override' property to override existing attributes already on the display. It represents the OVRATR keyword."), hideFormatting: true, validDataTypes: ["indicator", "expression"], controls: ["combo box", "date field", "output field", "password field", "select box", "spinner", "text area", "textbox"], context: "dspf", viewdesigner: false },
    { name: "put retain", choices: ["true", "false"], type: "boolean", help: pui.helpTextProperties("false", "You use this property with the 'overlay' property to prevent the handler from deleting data that is already on the display when the application displays the record again. It represents the PUTRETAIN keyword."), hideFormatting: true, validDataTypes: ["indicator", "expression"], controls: ["combo box", "date field", "output field", "password field", "select box", "spinner", "text area", "textbox"], context: "dspf", viewdesigner: false },
    { name: "disabled", attribute: "disabled", choices: ["true", "false"], type: "boolean", help: pui.helpTextProperties("false", "Determines whether the element is disabled or not. The user cannot use a disabled field in any way." + ((context == "genie") ? " A disabled field is not submitted to the server application." : "")), hideFormatting: true, validDataTypes: ["indicator", "expression"] },
    { name: "html", type: "long", allowNewLines: true, help: pui.helpTextProperties("placeholder", "Used to define custom html in an html container."), controls: ["html container"], translate: true },
    { name: "image source", type: "image", attribute: "src", help: pui.helpTextProperties("/profoundui/proddata/images/image.png", "Specifies the path to an image for an image or graphic button."), controls: ["image", "graphic button"] },
    { name: "hover image source", type: "image", help: pui.helpTextProperties("css", "Specifies the path to an image that will be displayed when the user hovers the mouse cursor over the image element."), controls: ["image"] },
    { name: "click image source", type: "image", help: pui.helpTextProperties("blank", "Specifies the path to an image that will be displayed when the user presses down the mouse on the image element."), controls: ["image"] },
    { name: "alternate text", attribute: "alt", help: pui.helpTextProperties("blank", "Specifies the alternate text for an image. The alternate text appears when the image cannot be rendered."), controls: ["image"], translate: true },
    { name: "label", help: pui.helpTextProperties("widget", "Specifies the caption text associated with a checkbox or a radio button."), controls: ["checkbox", "radio button"], translate: true },
    { name: "orientation", choices: ["horizontal", "vertical"], help: pui.helpTextProperties("theme", "Specifies the orientation of a slider or a menu element."), controls: ["menu", "slider"] },
    { name: "min value", format: "number", help: pui.helpTextProperties("blank", "Defines the minimum value for a spinner or slider element."), controls: ["slider", "spinner"] },
    { name: "max value", format: "number", help: pui.helpTextProperties("blank", "Defines the maximum value for a spinner or slider element."), controls: ["slider", "spinner"] },
    { name: "increment value", format: "number", help: pui.helpTextProperties("1", "Specifies how much the value in a spinner or slider element increases or decreases."), controls: ["slider", "spinner"] },
    { name: "read only", attribute: "readOnly", choices: ["true", "false"], type: "boolean", help: pui.helpTextProperties("false", "Defines whether the current element is read only or not. A read only element prevents the user from changing its value; however, the user can still interact with the element."), controls: ["checkbox", "combo box", "date field", "on off switch", "password field", "radio button", "signature pad", "spinner", "text area", "textbox"], hideFormatting: true, validDataTypes: ["indicator", "expression"] },
    { name: "input only", choices: ["true", "false"], bind: false, type: "boolean", help: pui.helpTextProperties("false", "Defines whether the current element is input only or not. An input only element is always initialized when the screen appears."), controls: ["checkbox", "combo box", "date field", "password field", "select box", "spinner", "text area", "textbox"], context: "dspf", viewdesigner: false },
    { name: "empty text", controls: ["combo box", "date field", "spinner", "text area", "textbox"], help: pui.helpTextProperties("blank", "Specifies the default text to place into an empty field. When the field receives focus, the text is removed. This property is similar to the 'placeholder' property, but provides support for older browser that may not yet support the placeholder HTML5 attribute."), translate: true },
    { name: "placeholder", attribute: "placeholder", controls: ["combo box", "date field", "spinner", "text area", "textbox", "password field"], help: pui.helpTextProperties("blank", "Uses the HTML5 placeholder attribute to specify a short hint that describes the expected value of an input field. Older browsers may not support this feature."), translate: true },
    { name: "input type", choices: ["color", "date", "datetime", "datetime-local", "email", "month", "number", "range", "search", "tel", "time", "url", "week"], controls: ["combo box", "date field", "textbox"], help: pui.helpTextProperties("textbox", "Specifies an HTML5 input type. Some types may not yet be supported by the user's browser or mobile device. If a type is not specified or if the selected type is not supported, a standard textbox element will be used.") },
    { name: "browser auto complete", hideFormatting: true, choices: ["on", "off", "Other..."], controls: ["combo box", "date field", "password field", "textbox", "spinner"], help: pui.helpTextProperties("off", "Specifies the value of the HTML textbox \"autocomplete\" attribute, which controls the browser's autocomplete/autofill feature. Browser autocomplete/autofill is disabled (\"off\") by default. Specify \"on\" to enable browser autocomplete/autofill or for further control, specify an autofill field name. See <a href=\"https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#autofill-field\" target=\"_blank\">here</a> for details on autofill field names.") },
    { name: "related field", help: pui.helpTextProperties("blank", "This property allows you to create a radio button group by associating multiple radio buttons with a field from the original application. Specify the id of the field to associate the radio button with. Additionally, this property can associate a text area with a group of textboxes by specify a comma separated list of textbox id's."), controls: ["radio button", "text area"], context: "genie" },
    { name: "select box height", format: "number", attribute: "size", choices: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "Other..."], help: pui.helpTextProperties("5", "If specified, the select box appears as a list box; if omitted, the select box appears as a dropdown.", ["other"]), controls: ["select box"] },
    { name: "multiple", attribute: "multiple", choices: ["true", "false"], type: "boolean", help: pui.helpTextProperties("false", "Specifies that multiple options can be selected at once in a List Box. The options are returned as a comma separated list."), controls: ["select box"], context: "dspf", hideFormatting: true, validDataTypes: ["indicator", "expression"] },
    { name: "set focus", choices: ["true", "false"], type: "boolean", help: pui.helpTextProperties("blank", "This property determines if the focus will be set to this field when the screen loads."), controls: ["checkbox", "combo box", "date field", "password field", "radio button", "select box", "spinner", "text area", "textbox"], context: "dspf", hideFormatting: true, validDataTypes: ["indicator", "expression"] },
    { name: "auto advance", choices: ["true", "false"], type: "boolean", help: pui.helpTextProperties("false", "Use this property to indicate that the user does not need to press Enter or otherwise manually submit the screen. Whenever the user keys a character (including a blank) into the last position of the field, the screen contents are submitted to the server as if the Enter key had been pressed."), controls: ["combo box", "date field", "password field", "spinner", "textbox"], context: "dspf", hideFormatting: true, validDataTypes: ["indicator", "expression"] },
    { name: "allow field exit", choices: ["true", "false"], type: "boolean", help: pui.helpTextProperties("true", "This property determines whether the field exit key (Numeric Pad Plus Sign by default) can be used to progress to the next input element."), controls: ["combo box", "date field", "select box", "spinner", "textbox"], context: "dspf", hideFormatting: true, validDataTypes: ["indicator", "expression"], viewdesigner: false },
    { name: "allow dup key", choices: ["true", "false"], type: "boolean", help: pui.helpTextProperties("false", "This property determines whether the Dup key (Shift-Insert by default) can be used on this element. It represents the DUP DDS keyword."), controls: ["date field", "textbox"], context: "dspf", hideFormatting: true, validDataTypes: ["indicator", "expression"], viewdesigner: false },
    { name: "dup key response", format: "1 / 0", readOnly: true, hideFormatting: true, validDataTypes: ["indicator"], help: pui.helpTextProperties("bind", "Specifies a response indicator that is returned to your program when the Dup key is used on this element."), controls: ["date field", "textbox"], context: "dspf", viewdesigner: false },
    { name: "prevent auto tab", choices: ["true", "false"], type: "boolean", help: pui.helpTextProperties("false", "This proprty prevents automatic tabbing on this element even when the pui['auto tab'] flag is set to true."), controls: ["combo box", "date field", "password field", "spinner", "textbox"], context: "dspf", hideFormatting: true, validDataTypes: ["indicator", "expression"] },
    { name: "shortcut key", choices: ["Enter", "Escape", "PageUp", "PageDown", "PrtScn", "Pause/Break", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12", "F13", "F14", "F15", "F16", "F17", "F18", "F19", "F20", "F21", "F22", "F23", "F24", "Alt-F1", "Alt-F2", "Alt-F3", "Alt-F4", "Alt-F5", "Alt-F6", "Alt-F7", "Alt-F8", "Alt-F9", "Alt-F10", "Alt-F11", "Alt-F12", "Alt-F13", "Alt-F14", "Alt-F15", "Alt-F16", "Alt-F17", "Alt-F18", "Alt-F19", "Alt-F20", "Alt-F21", "Alt-F22", "Alt-F23", "Alt-F24", "Ctrl-F1", "Ctrl-F2", "Ctrl-F3", "Ctrl-F4", "Ctrl-F5", "Ctrl-F6", "Ctrl-F7", "Ctrl-F8", "Ctrl-F9", "Ctrl-F10", "Ctrl-F11", "Ctrl-F12", "Ctrl-F13", "Ctrl-F14", "Ctrl-F15", "Ctrl-F16", "Ctrl-F17", "Ctrl-F18", "Ctrl-F19", "Ctrl-F20", "Ctrl-F21", "Ctrl-F22", "Ctrl-F23", "Ctrl-F24"], help: pui.helpTextProperties("blank", "Specifies a keyboard shortcut that can be used to trigger this element."), controls: ["button", "styled button", "graphic button", "hyperlink", "image", "menu", "css button", "icon"], context: "dspf" },
    { name: "response AID", choices: ["AutoEnter", "Clear", "Enter", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12", "F13", "F14", "F15", "F16", "F17", "F18", "F19", "F20", "F21", "F22", "F23", "F24", "Help", "PageDown", "PageUp", "Print", "RecordBackspace"], help: pui.helpTextProperties("Enter", "When screen is submitted for 'tab response' property, the AID code corresponding to the key specified here will be used. If not specified, the AID code for the Enter key will be used."), controls: ["tab panel"], context: "dspf" },
    { name: "cursor row", format: "number", help: pui.helpTextProperties("blank", "Identifies the cursor row number associated with this widget."), controls: ["combo box", "date field", "html container", "output field", "password field", "select box", "spinner", "text area", "textbox"], context: "dspf", viewdesigner: false },
    { name: "cursor column", format: "number", help: pui.helpTextProperties("blank", "Identifies the cursor column number associated with this widget."), controls: ["combo box", "date field", "html container", "output field", "password field", "select box", "spinner", "text area", "textbox"], context: "dspf", viewdesigner: false },
    { name: "changed", format: "1 / 0", readOnly: true, hideFormatting: true, validDataTypes: ["indicator"], help: pui.helpTextProperties("bind", "Specifies a response indicator that is set on if the data within the input element is modified."), controls: ["checkbox", "combo box", "date field", "password field", "select box", "spinner", "text area", "textbox"], context: "dspf" },
    { name: "is blank", format: "1 / 0", readOnly: true, hideFormatting: true, validDataTypes: ["indicator"], help: pui.helpTextProperties("bind", "Specifies a response indicator that is set on if the data within the input element is blank. The property allows you to distinguish between a blank and a zero within a numeric field."), controls: ["date field", "password field", "spinner", "text area", "textbox"], context: "dspf" },
    { name: "allow spellcheck", attribute: "spellcheck", choices: ["true", "false"], help: pui.helpTextProperties("true", "Set to false to disable the browser's built-in spellcheck for this widget."), hideFormatting: true, validDataTypes: ["indicator", "expression"], controls: ["textbox", "text area"] },
    { name: "messages", type: "messages", readOnly: true, bind: false, help: pui.helpTextProperties("blank", "Identifies messages used to populate this element."), relatedProperties: ["clear message", "message id prefix", "message id", "message file", "message library", "message condition"], context: "dspf", controls: ["button", "output field", "styled button", "text area", "textbox", "css button"], canBeRemoved: false },
    { name: "clear message", label: "Clear Message", checkbox: true, bind: false, multOccur: true, hide: true, help: "", context: "dspf", controls: ["button", "output field", "styled button", "text area", "textbox", "css button"] },
    { name: "message id prefix", label: "Message Id Prefix", uppercase: true, maxLength: 3, multOccur: true, hide: true, help: "", context: "dspf", controls: ["button", "output field", "styled button", "text area", "textbox", "css button"] },
    { name: "message id", label: "Message Id", uppercase: true, maxLength: 7, multOccur: true, hide: true, help: "", context: "dspf", controls: ["button", "output field", "styled button", "text area", "textbox", "css button"] },
    { name: "message file", label: "Message File", uppercase: true, maxLength: 10, multOccur: true, hide: true, help: "", context: "dspf", controls: ["button", "output field", "styled button", "text area", "textbox", "css button"] },
    { name: "message library", label: "Library", uppercase: true, maxLength: 10, multOccur: true, hide: true, help: "", context: "dspf", controls: ["button", "output field", "styled button", "text area", "textbox", "css button"] },
    { name: "message condition", label: "Condition", validDataTypes: ["indicator", "expression"], hideFormatting: true, readOnly: true, multOccur: true, hide: true, format: "1 / 0", type: "boolean", help: "", context: "dspf", controls: ["button", "output field", "styled button", "text area", "textbox", "css button"] },
    { name: "label for", help: pui.helpTextProperties("blank", "Specifies the ID of the element that this is a label for. This property will cause a &lt;label&gt; tag to be generated for this element with the 'for' attribute set to the ID specified."), canBeRemoved: true, controls: ["output field"] },

    { name: "Validation", category: true, context: "dspf" },
    { name: "error message location", choices: ["left", "right", "top", "bottom", "alert"], validDataTypes: ["char", "varchar", "string", "indicator", "expression"], help: pui.helpTextProperties("right", "Controls the position and orientation of validation and error tool tips. When 'alert' is selected, an alert box will be used instead of a tool tip."), context: "dspf" },
    { name: "error message css class", help: pui.helpTextProperties("pui-tip-error", "Specifies a css class name to apply to the top-level error tip element. This allows error tips to be styled individually. If not specified, css class 'pui-tip-error' is used, which gives error message styling. Try 'pui-tip-info' for an informational message."), context: "dspf" },
    { name: "mandatory entry", choices: ["true", "false"], type: "boolean", hideFormatting: true, validDataTypes: ["indicator", "expression"], help: pui.helpTextProperties("false", "When set to true, the user must modify the field by typing at least one character into the input box. A blank is a valid character."), controls: ["combo box", "date field", "password field", "spinner", "text area", "textbox"], context: "dspf" },
    { name: "mandatory fill", choices: ["true", "false"], type: "boolean", hideFormatting: true, validDataTypes: ["indicator", "expression"], help: pui.helpTextProperties("false", "When set to true, the user must type characters in all positions of the input box."), controls: ["combo box", "date field", "password field", "spinner", "textbox"], context: "dspf" },
    { name: "required", choices: ["true", "false"], type: "boolean", hideFormatting: true, validDataTypes: ["indicator", "expression"], help: pui.helpTextProperties("false", "When set to true, the element cannot be empty."), controls: ["combo box", "date field", "file upload", "password field", "select box", "spinner", "text area", "textbox", "file upload dnd"], context: "dspf" },
    { name: "valid values", type: "list", controls: ["combo box", "date field", "password field", "spinner", "text area", "textbox"], help: pui.helpTextProperties("blank", "Specifies a list of values that are valid for the user to type into the input box. The values should be comma separated."), context: "dspf" },
    { name: "comparison operator", choices: ["Equal", "Not Equal", "Greater Than", "Greater Than or Equal", "Less Than", "Less Than or Equal"], controls: ["combo box", "date field", "password field", "spinner", "text area", "textbox"], help: pui.helpTextProperties("blank", "Identifies the relational operator used to compare data in the input box with the specified comparison value."), context: "dspf" },
    { name: "comparison value", controls: ["combo box", "date field", "password field", "spinner", "text area", "textbox"], help: pui.helpTextProperties("blank", "Specifies the value used for comparing against data in the input box. This property is used in combination with the comparison operator property."), context: "dspf" },
    { name: "range low", controls: ["combo box", "date field", "password field", "spinner", "text area", "textbox"], help: pui.helpTextProperties("blank", "Specifies the minimum value for range validity checking. The data in the input box must be greater than or equal to this value."), context: "dspf" },
    { name: "range high", controls: ["combo box", "date field", "password field", "spinner", "text area", "textbox"], help: pui.helpTextProperties("blank", "Specifies the maximum value for range validity checking. The data in the input box must be less than or equal to this value."), context: "dspf" },
    { name: "validate name", choices: ["true", "false"], type: "boolean", hideFormatting: true, validDataTypes: ["indicator", "expression"], help: pui.helpTextProperties("blank", "Use this property to specify that the data typed into the field must be a valid simple name. The first character must be $, #, @, or A through Z. The remaining characters must be alphanumeric ($, #, @, A through Z, 0 through 9, or underscore (_), and must not contain embedded blanks."), controls: ["combo box", "textbox"], context: "dspf" },
    { name: "validate email", choices: ["true", "false"], type: "boolean", hideFormatting: true, validDataTypes: ["indicator", "expression"], help: pui.helpTextProperties("blank", "Use this property to specify that the data typed into the field must be in the format of an email address."), controls: ["combo box", "textbox"], context: "dspf" },
    { name: "allow blanks", choices: ["true", "false"], type: "boolean", hideFormatting: true, validDataTypes: ["indicator", "expression"], help: pui.helpTextProperties("false", "When set to true, blank input will satisfy validity checking should any other associated validity check fail."), controls: ["combo box", "date field", "password field", "spinner", "text area", "textbox"], context: "dspf" },
    { name: "error messages", type: "errmessages", readOnly: true, bind: false, help: pui.helpTextProperties("blank", "Identifies error messages to be displayed in association with this element."), relatedProperties: ["error message", "error message id", "error message file", "error message library", "replacement data", "error condition", "error response", "error enhanced mode"], context: "dspf", canBeRemoved: false },
    { name: "error message", label: "Message Text", multOccur: true, hide: true, help: "", context: "dspf" },
    { name: "error message id", label: "Message Id", uppercase: true, maxLength: 7, multOccur: true, hide: true, help: "", context: "dspf", viewdesigner: false },
    { name: "error message file", label: "Message File", maxLength: 10, uppercase: true, multOccur: true, hide: true, help: "", context: "dspf", viewdesigner: false },
    { name: "error message library", label: "Library", maxLength: 10, uppercase: true, multOccur: true, hide: true, help: "", context: "dspf", viewdesigner: false },
    { name: "replacement data", label: "Replacement Data", validDataTypes: ["char"], hideFormatting: true, readOnly: true, multOccur: true, hide: true, help: "", context: "dspf", viewdesigner: false },
    { name: "error condition", label: "Error Condition", validDataTypes: ["indicator", "expression"], hideFormatting: true, readOnly: true, multOccur: true, hide: true, format: "1 / 0", type: "boolean", help: "", context: "dspf" },
    { name: "error response", label: "Error Response", validDataTypes: ["indicator"], hideFormatting: true, readOnly: true, multOccur: true, hide: true, format: "1 / 0", type: "boolean", help: "", context: "dspf", viewdesigner: false },
    { name: "error enhanced mode", label: "Enhanced Mode", checkbox: true, bind: false, multOccur: true, hide: true, help: pui.helpTextProperties("[checked]", "If checked, allows error messages to display without ERRMSG/ERRMSGID-type restrictions. Errors can display regardless of whether format is already on the screen, and output data is also sent."), context: "dspf", viewdesigner: false },
    { name: "set as modified", choices: ["true", "false"], type: "boolean", hideFormatting: true, validDataTypes: ["indicator", "expression"], help: pui.helpTextProperties("blank", "Marks an input field as modified when it is first displayed."), controls: ["check box", "combo box", "date field", "password field", "radio button", "select box", "slider", "spinner", "text area", "textbox"], context: "dspf" },
    { name: "bypass validation", choices: ["true", "false", "send data"], type: "boolean", controls: ["button", "styled button", "graphic button", "hyperlink", "image", "menu", "tab panel", "chart", "css button", "icon"], help: pui.helpTextProperties("blank", "This property, typically used on Cancel or Undo buttons, specifies that the element will not trigger client-side validation and will automatically discard all data modified by the user on the screen. It represents the CAxx set of DDS keywords. You can select 'send data' to bypass all client-side validation except for field data type validation and still send all data modified by the user."), validDataTypes: ["char", "indicator", "expression"], context: "dspf" },

    { name: "Auto-Complete Choices", category: true, controls: ["textbox"] },
    { name: "Selection Choices", category: true, controls: ["combo box", "select box"] },
    { name: "Menu Options", category: true, controls: ["menu"] },
    { name: "choices", type: "list", help: pui.helpTextProperties("Option 1, Option 2, Option 3...", "Specifies the options for a select box (dropdown or list box), text field with autocomplete, combo box, or menu. The options should be comma separated. To specify submenus for a menu, indent the choices using a dash or a series of dashes."), controls: ["combo box", "menu", "select box", "textbox"], translate: true },
    { name: "choice values", type: "list", help: pui.helpTextProperties("css", "Specifies alternate option values to send to the application for a select box (dropdown or list box), text field with auto complete, combo box, or menu. The values should be comma separated."), controls: ["combo box", "menu", "select box", "textbox"] },
    { name: "hover background color", type: "color", help: pui.helpTextProperties("css", "Defines the background color of a menu option when the user hovers the mouse over it.", ["background color"]), controls: ["menu"] },
    { name: "hover text color", type: "color", help: pui.helpTextProperties("css", "Defines the text color of a menu option when the user hovers the mouse over it.", ["color"]), controls: ["menu"] },
    { name: "animate", choices: ["true", "false"], blankChoice: false, help: pui.helpTextProperties("true", "Determines if hovering over menu options is animated."), controls: ["menu"] },
    { name: "border color", type: "color", help: pui.helpTextProperties("css", "The color of the border used for menu options.", ["color"]), controls: ["menu"] },
    { name: "menu option padding", choices: paddings, format: "px", help: pui.helpTextProperties("css", "Sets the distance between the edge of the menu option and the menu option text.", ["other", "pixel"]), controls: ["menu"] },
    { name: "menu option indent", choices: paddings, format: "px", help: pui.helpTextProperties("css", "Sets the distance between the left edge of the menu option and the menu option text.", ["other", "pixel"]), controls: ["menu"] },
    { name: "option image", type: "image", help: pui.helpTextProperties("css", "Defines the background image displayed under each menu option. You can specify one image or a comma separated list of images corresponding to each menu option."), controls: ["menu"] },
    { name: "option hover image", type: "image", help: pui.helpTextProperties("css", "Defines the background image displayed when the user hovers over a menu option."), controls: ["menu"] },
    { name: "onoptionclick", type: "js", help: pui.helpTextProperties("blank", "Initiates a client-side script when a menu option is clicked. The choice value is passed to the event as a parameter named 'value'. The choice text is passed to the event as a parameter named 'text'."), controls: ["menu"] },

    { name: "Database-Driven Auto-Complete", category: true, controls: ["textbox"] },
    { name: "Database-Driven Selection", category: true, controls: ["combo box", "select box"] },
    { name: "Database-Driven Chart", category: true, controls: ["chart"] },
    { name: "Database-Driven Image Data", category: true, controls: ["image"] },

    { name: "remote system name", bind: true, uppercase: (pui.nodedesigner !== true), help: pui.helpTextProperties("Local", "Name of database where file is located. Used only if data to be retrieved is stored on a remote server."), controls: ["textbox", "combo box", "select box", "grid", "chart", "image"], nodedesigner: false},
    { name: "database file", type: "file", displayName: (pui.nodedesigner ? "database table" : undefined), uppercase: (pui.nodedesigner !== true), help: pui.helpTextProperties("blank", "Database table to use for the chart's data source."), controls: ["chart"] },
    { name: "name field", type: "field", uppercase: (pui.nodedesigner !== true), help: pui.helpTextProperties("blank", "Database field that determines the names by which records would be represented in the chart."), controls: ["chart"] },
    { name: "value field", type: "field", uppercase: (pui.nodedesigner !== true), help: pui.helpTextProperties("blank", "Database field that determines the numerical values from which the chart is to be built."), controls: ["chart"] },
    { name: "summary option", choices: ["none", "average", "count", "sum", "maximum", "minimum"], help: pui.helpTextProperties("blank", "Determines how values are used when creating the chart."), controls: ["chart"] },
    { name: "selection criteria", type: "long", help: pui.helpTextProperties("blank", "Optional expression identifying which records should be retrieved from the database table."), controls: ["chart"] },
    { name: "parameter value", bind: true, type: "long", secLevel: 1, multOccur: true, help: pui.helpTextProperties("blank", "Value for parameter marker in 'selection criteria' or 'custom sql' properties. Parameter markers are specified using a question mark. Profound UI will accept values from the client for any parameter marker values which are not bound to program fields. Parameter markers are numbered in order of occurence, from left to right. To specify multiple parameter marker values, right-click the property and select Add Another Parameter Value."), controls: ["chart"] },
    { name: "record limit", format: "number", help: pui.helpTextProperties("blank", "Sets a limit on how many records are to be used in the chart."), controls: ["chart"] },    
    { name: "custom sql", type: "long", help: pui.helpTextProperties("blank","Specifies an SQL statement to use to retrieve the records for a database-driven chart. The last column is used as the chart values. Earlier columns are concatenated into the chart labels."), controls: ["chart"]},
    
    { name: "blob table", type: "file", uppercase: (pui.nodedesigner !== true), help: pui.helpTextProperties("blank", "Database table that contains a blob for this image."), controls: ["image"] },
    { name: "blob column", type: "field", uppercase: (pui.nodedesigner !== true), help: pui.helpTextProperties("blank", "Blob column in database table that image will be loaded from."), controls: ["image"] },
    { name: "blob selection criteria", type: "long", help: pui.helpTextProperties("blank", "Expression expression identifying which row to load image blob from."), controls: ["image"] },
    { name: "blob parameter value", bind: true, type: "long", multOccur: true, help: pui.helpTextProperties("blank", "Value for parameter marker in 'blob selection criteria' property. Parameter markers are specified using a question mark. Profound UI will accept values from the client for any parameter marker values which are not bound to program fields. Parameter markers are numbered in order of occurence, from left to right. To specify multiple parameter marker values, right-click the property and select Add Another Blob Parameter Value."), controls: ["image"] },

    { name: "choices database file", type: "file", displayName: (pui.nodedesigner ? "choices database table" : undefined), uppercase: (pui.nodedesigner !== true), help: pui.helpTextProperties("blank", "Database table to be used for a dynamic database-driven dropdown box, list box, or text field with autocomplete."), controls: ["combo box", "select box", "textbox"] },
    { name: "choice options field", type: "field", multiple: true, uppercase: (pui.nodedesigner !== true), help: pui.helpTextProperties("blank", "Database field name used to retrieve the options for a dynamic dropdown box, list box, combo box, or text field with auto complete. Multiple fields can be specifed for a text field with auto complete. In this case, the field names should be comma separated."), controls: ["combo box", "select box", "textbox"] },
    { name: "choice values field", type: "field", uppercase: (pui.nodedesigner !== true), help: pui.helpTextProperties("[choice options field]", "Database field name used to retrieve the values sent back to the application. If omitted, the choice options field is used. In the case of a text field with autocomplete that has multiple option fields, the first option field is used."), controls: ["combo box", "select box", "textbox"] },
    { name: "choices selection criteria", type: "long", help: pui.helpTextProperties("blank", "Optional expression identifying which records should be retrieved from the choices database table."), controls: ["combo box", "select box", "textbox"] },
    { name: "choices parameter value", bind: true, type: "long", secLevel: 1, multOccur: true, help: pui.helpTextProperties("blank", "Value for parameter marker in 'choices selection criteria' property. Parameter markers are specified using a question mark. Profound UI will accept values from the client for any parameter marker values which are not bound to program fields. Parameter markers are numbered in order of occurence, from left to right. To specify multiple parameter marker values, right-click the property and select Add Another Choices Parameter Value."), controls: ["combo box", "select box", "textbox"] },
    { name: "blank option", choices: ["true", "false"], help: pui.helpTextProperties("false", "When set to true, a database-driven dropdown box will display a blank option before the options from the database table are displayed."), controls: ["combo box", "select box"] },
    { name: "blank option label", help: pui.helpTextProperties("blank", "By default, the blank option contains no text. Use this property to specify alternate text to be displayed in the blank option. The value sent to the server will still be blank."), controls: ["combo box", "select box"], translate: true },
    { name: "order by", type: "field", multiple: true, uppercase: (pui.nodedesigner !== true), help: pui.helpTextProperties("blank", "Optional expression identifying which fields determine the order of the items. For a database-driven chart, this property is ignored when <i>'summary option'</i> is used. In this case, the items will sort on the <i>'name field'</i>."), controls: ["combo box", "select box", "chart", "textbox"] },
    { name: "max choices", format: "number", help: pui.helpTextProperties("[500 or 10]", "Optional maximum number of choices to provide for a dynamic dropdown box, list box, or text field with auto complete. If blank: defaults to 500 for dropdown, 10 for auto complete."), controls: ["combo box", "select box", "textbox"] },
    { name: "contains match", choices: ["true", "false"], help: pui.helpTextProperties("false", "When set to true, the auto-complete query finds records that contain the search text. When set to false, the auto-complete query finds records that start with the search text."), controls: ["textbox"] },
    { name: "case sensitive", choices: ["true", "false"], help: pui.helpTextProperties("false", "When set to true, the auto-complete query does not convert the database search column to upper case before comparing. When false, the database column and search text are converted to upper case before comparing."), controls: ["textbox"] },

    { name: "Dynamic Auto-Complete", category: true, controls: ["textbox"] },
    { name: "Dynamic Selection", category: true, controls: ["combo box", "select box"] },
    { name: "choices url", type: "long", help: pui.helpTextProperties("blank", "Sets the url to a Web service that returns the choice options and values in JSON format. If a choices url is used, the database " + (pui.nodedesigner ? "table" : "file") + ", choice options field, choice value field, and max choices properties are ignored."), controls: ["combo box", "select box", "textbox"] },

    { name: "Chart Settings", category: true, controls: ["chart"] },
    { name: "chart type", choices: pui.widgets.getChartTypes, help: pui.helpTextProperties("[selected chart]", "Identifies the type of chart to display. The chart type matches the JavaScript alias listed in the FusionCharts documentation. The available chart names are provided here: <br /><br /> <a target='_blank' href='https://www.fusioncharts.com/dev/chart-guide/getting-started/list-of-charts'>List of FusionCharts Charts files</a><br /><br /> HTML5 is used to render the chart."), controls: ["chart"] },
    { name: "map type", help: pui.helpTextProperties("world", "Identifies the type of map to display. The available map names are provided here: <br /><br /> <a target='_blank' href='http://www.fusioncharts.com/dev/usage-guide/setup/list-of-maps.html'>List of FusionCharts Maps files</a><br /><br />Specifiy the 'JavaScript alias' name, with or without the 'maps/' prefix. If this property is specified, the 'chart type' property is ignored."), controls: ["chart"] },
    { name: "chart options", type: "long", allowNewLines: true, help: pui.helpTextProperties("blank", "Specifies chart options as a set of XML attributes that are to be attached to the FusionCharts &lt;chart&gt; tag. The format of the attributes is described on the FusionCharts documentation site: <a href='https://www.fusioncharts.com/dev/chart-attributes/?chart=area2d' target='_blank'>Chart Attributes</a>."), controls: ["chart"] },
    { name: "chart overlay", choices: ["true", "false"], help: pui.helpTextProperties("false", "When set to true, the Chart panel will overlay any other content on the screen, regardless of z-index settings. When set to false, the Chart panel will behave according to normal layering rules, based on z-index."), controls: ["chart"] },
    { name: "onchartclick", type: "js", help: pui.helpTextProperties("blank", "Initiates a client-side script when a chart section is clicked. The name of the chart section is passed to the event as a parameter named 'name'."), controls: ["chart"] },

    { name: "Chart Data" + ((context == "genie") ? " from Screen" : ""), category: true, controls: ["chart"] },
    { name: "names", type: "list", help: pui.helpTextProperties("blank", "Specifies a list of names representing the data points on the chart or a list of screen element id's from which the names could be retrieved. The list should be comma separated."), controls: ["chart"], translate: true },
    { name: "values", type: "list", help: pui.helpTextProperties("blank", "Specifies a list of numerical values used to build the chart or a list of screen element id's from which the values could be retrieved. The list should be comma separated."), controls: ["chart"] },

    { name: "Dynamic Chart", category: true, controls: ["chart"] },
    { name: "chart url", type: "long", help: pui.helpTextProperties("blank", "Sets the url to a web service that returns the chart definition and data in XML format as specified in the FusionCharts Data Formats section of the FusionCharts documentation site: <a href='https://www.fusioncharts.com/dev/' target='_blank'>FusionCharts Documentation</a>."), controls: ["chart"] },
    { name: "chart url json", type: "long", help: pui.helpTextProperties("blank", "Sets the url to a web service that returns the chart definition and data in JSON format as specified in the FusionCharts Data Formats section of the FusionCharts documentation site: <a href='https://www.fusioncharts.com/dev/' target='_blank'>FusionCharts Documentation</a>."), controls: ["chart"] },
    { name: "chart xml", type: "long", allowNewLines: true, help: pui.helpTextProperties("blank", "Sets the XML data for the chart as specified in the FusionCharts Data Formats section of the FusionCharts documentation site: <a href='https://www.fusioncharts.com/dev/' target='_blank'>FusionCharts Documentation</a>."), controls: ["chart"] },
    { name: "chart json", type: "long", allowNewLines: true, help: pui.helpTextProperties("blank", "Sets the JSON data for the chart as specified in the FusionCharts Data Formats section of the FusionCharts documentation site: <a href='https://www.fusioncharts.com/dev/' target='_blank'>FusionCharts Documentation</a>. The data can be provided as a string or as a JavaScript object through the use of property scripting."), controls: ["chart"] },

    { name: "Background", category: true },
    { name: "background color", stylename: "backgroundColor", type: "color", help: pui.helpTextProperties("css", "Defines the background color of the given element.", ["background color"]), formattingProp: true },
    { name: "background image", type: "image", stylename: "backgroundImage", help: pui.helpTextProperties("css", "Defines the background image of the current element."), formattingProp: true },
    { name: "background position", stylename: "backgroundPosition", choices: ["top", "center", "bottom", "left"], help: pui.helpTextProperties("css", "Position of the background within the current element."), formattingProp: true },
    { name: "background repeat", stylename: "backgroundRepeat", choices: ["repeat-x", "repeat-y", "no-repeat", "repeat"], help: pui.helpTextProperties("css", "Defines how to repeat the background, repeat-x: repeats horizontally, repeat-y: repeats vertically, no-repeat: doesn't repeat at all, repeat: repeats horizontally and vertically."), formattingProp: true },

    { name: "Position", category: true },
    { name: "left", stylename: "left", format: "px", help: pui.helpTextProperties("position", "Represents the x-coordinate of the current element. Specify in pixels" + ((context == "genie") ? "." : " or as a percentage.")) },
    { name: "top", stylename: "top", format: "px", help: pui.helpTextProperties("position", "Represents the y-coordinate of the current element. Specify in pixels" + ((context == "genie") ? "." : " or as a percentage.")) },
    { name: "right", stylename: "right", format: "px", help: pui.helpTextProperties("blank", "Position of the element from the right of the screen" + ((context == "genie") ? "." : " or layout container.") + " Specify in pixels" + ((context == "genie") ? "." : " or as a percentage.")) },
    { name: "bottom", stylename: "bottom", format: "px", help: pui.helpTextProperties("blank", "Position of the element from the bottom of the screen" + ((context == "genie") ? "." : " or layout container.") + " Specify in pixels" + ((context == "genie") ? "." : " or as a percentage.")) },
    { name: "height", stylename: "height", format: "px", help: pui.helpTextProperties("widget", "Height of the current element. Specify in pixels" + ((context == "genie") ? "." : " or as a percentage.")) },
    { name: "width", stylename: "width", format: "px", help: pui.helpTextProperties("widget", "Width of the current element. Specify in pixels" + ((context == "genie") ? "." : " or as a percentage.")) },
    { name: "min height", stylename: "minHeight", format: "px", help: pui.helpTextProperties("css", "Minimum height of the current element.", ["pixel"]) },
    { name: "min width", stylename: "minWidth", format: "px", help: pui.helpTextProperties("css", "Minimum width of the current element." , ["pixel"]) },
    { name: "max height", stylename: "maxHeight", format: "px", help: pui.helpTextProperties("css", "Maximum height of the current element.", ["pixel"]) },
    { name: "max width", stylename: "maxWidth", format: "px", help: pui.helpTextProperties("css", "Maximum width of the current element.", ["pixel"]) },
    { name: "z index", stylename: "zIndex", format: "number", help: pui.helpTextProperties("css", "The stacking order of the current element, expressed as an integer value. The element with the higher z index will overlay lesser elements.") },
    { name: "auto arrange", choices: ["true", "false"], type: "boolean", validDataTypes: ["indicator", "expression"], hideFormatting: true, help: pui.helpTextProperties("false", "This property is used to automatically position action buttons or links in order to accommodate for converted overlay screens."), controls: ["button", "styled button", "graphic button", "hyperlink", "css button"], context: "dspf" },
    { name: "locked in place", choices: ["true", "false"], help: pui.helpTextProperties("false", "If set to true, the element cannot be moved or sized."), bind: false },

    { name: "Drag and Drop", category: true, controls: ["html container", "output field", "image"], context: "dspf" },
    { name: "allow drag", choices: ["true", "false"], type: "boolean", validDataTypes: ["indicator", "expression"], hideFormatting: true, help: pui.helpTextProperties("false", "This property determines if the element can be drag and dropped."), controls: ["html container", "output field", "image", "ajax container", "button", "graphic button", "styled button", "css button"], context: "dspf" },
    { name: "use proxy", choices: ["true", "false"], type: "boolean", validDataTypes: ["indicator", "expression"], hideFormatting: true, help: pui.helpTextProperties("false", "This property determines if a drag and drop proxy is created. If set to true, instead of dragging the element around, a proxy element is created and moved instead."), controls: ["html container", "output field", "image", "ajax container", "button", "graphic button", "styled button", "css button"], context: "dspf" },
    { name: "ondragstart", type: "js", help: pui.helpTextProperties("blank", "Initiates a client-side script when the user first starts to drag the element. Information about the drag and drop operation is provided using the global pui.dragDropInfo object."), controls: ["html container", "output field", "image", "ajax container", "button", "graphic button", "styled button", "css button"], context: "dspf" },
    { name: "drop targets", type: "list", help: pui.helpTextProperties("blank", "Specifies a list of target element id's, which identify where this element can be dropped."), controls: ["html container", "output field", "image", "ajax container", "button", "graphic button", "styled button", "css button"], context: "dspf" },
    { name: "ondragenter", type: "js", help: pui.helpTextProperties("blank", "Initiates a client-side script when the user drags an element over a valid drop target. Information about the drag and drop operation is provided using the global pui.dragDropInfo object."), controls: ["html container", "output field", "image", "ajax container", "button", "graphic button", "styled button", "css button"], context: "dspf" },
    { name: "ondragleave", type: "js", help: pui.helpTextProperties("blank", "Initiates a client-side script when the user moves an element out of a valid drop target during a drag operation. Information about the drag and drop operation is provided using the global pui.dragDropInfo object."), controls: ["html container", "output field", "image", "ajax container", "button", "graphic button", "styled button", "css button"], context: "dspf" },
    { name: "ondrop", type: "js", help: pui.helpTextProperties("blank", "Initiates a client-side script when the mouse is released during a drag and drop operation. Information about the drag and drop operation is provided using the global pui.dragDropInfo object."), controls: ["html container", "output field", "image", "ajax container", "button", "graphic button", "styled button", "css button"], context: "dspf" },

    { name: "Tabs", category: true },
    { name: "tab panel style", choices: pui.widgets.getTabStyles, help: pui.helpTextProperties("theme", "Identifies the look and feel of the tab panel."), controls: ["tab panel"] },
    { name: "tab names", type: "list", help: pui.helpTextProperties("Tab 1,Tab 2,Tab 3", "This property identifies a comma separated list of tab names for a Tab Panel."), controls: ["tab panel"], translate: true },
    { name: "active tab", format: "number", hideFormatting: true, validDataTypes: ["zoned"], help: pui.helpTextProperties("0", "This property specifies the initial active tab on a Tab Panel. Each tab within a Tab Panel is identified by a sequential index, starting with 0 for the first tab, 1 for the second tab, and so on."), controls: ["tab panel"] },
    { name: "ontabclick", type: "js", help: pui.helpTextProperties("blank", "Initiates a client-side script when a tab is clicked. The tab index is passed to the event as a parameter named 'tab'. If the client-side script evaluates to false, the tab will not be switched."), controls: ["tab panel"] },
    { name: "tab keys", type: "list", help: pui.helpTextProperties("blank", "This property identifies a comma separated list of function keys assigned to each tab within a Tab Panel. The function keys in the list are automatically pressed when the appropriate tab is selected, allowing users to navigate the original application through a tab interface."), controls: ["tab panel"], context: "genie" },
    { name: "parent tab panel", help: pui.helpTextProperties("position", "This property specifies the id of the Tab Panel to which this element belongs. The property is set automatically when you drag and drop the element onto a Tab Panel."), bind: false },
    { name: "parent tab", help: pui.helpTextProperties("position", "This property specifies the tab index of the specific tab to which this element belongs. Each tab within a Tab Panel is identified by a sequential index, starting with 0 for the first tab, 1 for the second tab, and so on. The property is set automatically when you drag and drop the element onto a Tab Panel."), bind: false },
    { name: "parent field set", help: pui.helpTextProperties("position", "This property specifies the id of the Field Set Panel to which this element belongs. The property is set automatically when you drag and drop the element onto a Field Set Panel."), bind: false },

    { name: "File Upload", category: true, controls: ["file upload", "file upload dnd"] },
    { name: "selection mode", controls: ["file upload"], bind: false, choices: ["standard", "enhanced", "single"], help: pui.helpTextProperties("standard", "When set to 'enhanced' the file upload control will allow for selection of multiple files at once from the browser's file selector. This is accomplished by SHIFT+Click or CNTRL+Click or CNTRL+A. When 'standard' mode is used, the user must select each file for upload one by one. When 'single' mode is used, only one file can be chosen.", null, "Not all browsers support 'enhanced' mode. For example, Internet Explorer does not. In such browsers, the control will work in 'standard' mode regardless of this setting.") },
    { name: "auto submit", controls: ["file upload dnd"], choices: ["true", "false"], type: "boolean", hideFormatting: true, context: "dspf", validDataTypes: ["indicator", "expression"], help: pui.helpTextProperties("false", "After dropping a file should a page submit happen automatically. Upload happens during submit.") },
    { name: "auto upload", controls: ["file upload dnd"], choices: ["true", "false"], type: "boolean", hideFormatting: true, context: "genie", validDataTypes: ["indicator", "expression"], help: pui.helpTextProperties("false", "After dropping a file should upload happen automatically.") },
    { name: "number of files", controls: ["file upload", "file upload dnd"], format: "number", hideFormatting: true, validDataTypes: ["zoned"], help: pui.helpTextProperties("1", "This property specifies the maximum number of files that can be uploaded at one time.") },
    { name: "size limit", controls: ["file upload", "file upload dnd"], hideFormatting: true, validDataTypes: ["zoned"], help: pui.helpTextProperties("10", "Specifies the size limit (in MB) for each file.") },
    { name: "target directory", controls: ["file upload", "file upload dnd"], defaultDataLength: 50, hideFormatting: true, validDataTypes: ["char", "varchar", "string"], help: pui.helpTextProperties("blank", "This property specifies the IFS directory where uploaded files will be saved.") },
    { name: "rename to", controls: ["file upload", "file upload dnd"], defaultDataLength: 50, hideFormatting: true, validDataTypes: ["char", "varchar", "string"], help: pui.helpTextProperties("blank", "Specifies an alternate file name to be used when the uploaded file is saved.", null, "This property is ignored when more than 1 file is uploaded.") },
    { name: "overwrite files", controls: ["file upload", "file upload dnd"], choices: ["true", "false"], type: "boolean", hideFormatting: true, validDataTypes: ["indicator", "expression"], help: pui.helpTextProperties("false", "Specifies the action to take when 1 or more files being saved already exists in the IFS target directory. When set to 'true', any existing files will be overwritten. When set to 'false' no files will be overwritten. If \"generate unique names\" is set to true, then the files will be saved with automatically generated unique names. Otherwise, an error will be returned when files already exist.") },
    { name: "generate unique names", controls: ["file upload", "file upload dnd"], choices: ["true", "false"], type: "boolean", hideFormatting: true, validDataTypes: ["indicator", "expression"], help: pui.helpTextProperties("false", "If set to 'true' and \"overwrite files\" is set to 'false', then any uploaded files that already exist on the file system will be saved with automatically generated unique names.") },
    { name: "allowed type", controls: ["file upload", "file upload dnd"], multOccur: true, choices: ["text/plain", "application/vnd.ms-word", "application/vnd.ms-excel", "application/pdf", "image/gif", "image/jpg", "image/png", "Other..."], hideFormatting: true, validDataTypes: ["char", "varchar", "string"], help: pui.helpTextProperties("[all file types]", "Specifies a MIME file type (as reported by the web browser) which is allowed to be uploaded. If not set, any file type will be allowed.<br /><br />To specify multiple types, right-click the property and select Add Another Allowed Type.", ["other"]) },
    { name: "onupload", type: "js", help: pui.helpTextProperties("blank", "Initiates a client-side script when files are uploaded."), controls: ["file upload", "file upload dnd"], context: "genie" },

    { name: "Borders", category: true },
    { name: "border radius", stylename: "borderRadius", format: "px", choices: ["1px", "2px", "3px", "4px", "5px", "6px", "7px", "8px", "9px", "10px", "11px", "12px", "13px", "14px", "15px", "16px", "17px", "18px", "19px", "20px", "Other..."], help: pui.helpTextProperties("css", "This property allow you to create rounded corners by specifying a border radius.", ["other"]) },
    { name: "border bottom color", stylename: "borderBottomColor", type: "color", help: pui.helpTextProperties("css", "The color of the element's bottom side of the border.", ["color"]) },
    { name: "border bottom style", stylename: "borderBottomStyle", choices: borderStyles, help: pui.helpTextProperties("css", "The style of the element's bottom side of the border.") },
    { name: "border bottom width", format: "px", stylename: "borderBottomWidth", choices: borderWidths, help: pui.helpTextProperties("css", "The thickness of the element's bottom side of the border.", ["other"]) },
    { name: "border left color", stylename: "borderLeftColor", type: "color", help: pui.helpTextProperties("css", "The color of the element's left side of the border.", ["color"]) },
    { name: "border left style", stylename: "borderLeftStyle", choices: borderStyles, help: pui.helpTextProperties("css", "The style of the element's left side of the border.") },
    { name: "border left width", format: "px", stylename: "borderLeftWidth", choices: borderWidths, help: pui.helpTextProperties("css", "The thickness of the element's left side of the border.", ["other"]) },
    { name: "border right color", stylename: "borderRightColor", type: "color", help: pui.helpTextProperties("css", "The color of the element's right bottom side of the border.", ["color"]) },
    { name: "border right style", stylename: "borderRightStyle", choices: borderStyles, help: pui.helpTextProperties("css", "The style of the element's right side of the border.") },
    { name: "border right width", format: "px", stylename: "borderRightWidth", choices: borderWidths, help: pui.helpTextProperties("css", "The thickness of the element's right side of the border.", ["other"]) },
    { name: "border top color", stylename: "borderTopColor", type: "color", help: pui.helpTextProperties("css", "The color of the element's top side of the border.", ["color"]) },
    { name: "border top style", stylename: "borderTopStyle", choices: borderStyles, help: pui.helpTextProperties("css", "The style of the element's top side of the border.") },
    { name: "border top width", format: "px", stylename: "borderTopWidth", choices: borderWidths, help: pui.helpTextProperties("css", "The thickness of the element's top side of the border.", ["other"]) },

    { name: "Padding", category: true },
    { name: "padding bottom", format: "px", stylename: "paddingBottom", choices: paddings, help: pui.helpTextProperties("css", "Sets the distance between the bottom edge of the current element and the element's content.", ["other", "pixel"]), formattingProp: true },
    { name: "padding left", format: "px", stylename: "paddingLeft", choices: paddings, help: pui.helpTextProperties("css", "Sets the distance between the left edge of the current element and the element's content.", ["other", "pixel"]), formattingProp: true },
    { name: "padding right", format: "px", stylename: "paddingRight", choices: paddings, help: pui.helpTextProperties("css", "Sets the distance between the right edge of the current element and the element's content.", ["other", "pixel"]), formattingProp: true },
    { name: "padding top", format: "px", stylename: "paddingTop", choices: paddings, help: pui.helpTextProperties("css", "Sets the distance between the top edge of the current element and the element's content.", ["other", "pixel"]), formattingProp: true },

    { name: "Classes", category: true, context: "dspf" },
    { name: "css class", type: "cssClass", multOccur: true, help: pui.helpTextProperties("widget", "Defines a custom cascading style sheet class to assign to the element. To specify multiple classes, right-click the property and select Add Another CSS Class."), context: "dspf" },
    { name: "focus class", help: pui.helpTextProperties("blank", "Defines a custom cascading style sheet class for when the element receives focus."), context: "dspf", controls: ["combo box", "date field", "password field", "select box", "spinner", "text area", "textbox"] },
    { name: "display attribute field", readOnly: true, hideFormatting: true, validDataTypes: ["char"], defaultDataLength: 1, help: pui.helpTextProperties("bind", "This property identifies a field containing a display attribute hex value. It represents the DSPATR keyword with a program to system field parameter. The hex value is translated to the appropriate css class at run time."), context: "dspf", viewdesigner: false },

    { name: "Misc", category: true },
    { name: "css class", type: "cssClass", attribute: "class", help: pui.helpTextProperties("theme", "Defines a custom cascading style sheet class to assign to the element."), context: "genie" },
    { name: "cursor", stylename: "cursor", choices: ["auto", "default", "crosshair", "pointer", "move", "e-resize", "ne-resize", "nw-resize", "n-resize", "se-resize", "sw-resize", "s-resize", "w-resize", "text", "wait", "help", "Other..."], help: pui.helpTextProperties("css", "Determines how the mouse cursor should look when hovering over the element. <br><br><u>Valid options</u>: <span style='cursor:default;'>default</span>, <span style='cursor:crosshair;'>crosshair</span>, <span style='cursor:pointer;'>pointer</span>, <span style='cursor:move;'>move</span>, <span style='cursor:e-resize;'>e-resize</span>, <span style='cursor:ne-resize;'>ne-resize</span>, <span style='cursor:nw-resize;'>nw-resize</span>, <span style='cursor:n-resize;'>n-resize</span>, <span style='cursor:se-resize;'>se-resize</span>, <span style='cursor:sw-resize;'>sw-resize</span>, <span style='cursor:s-resize;'>s-resize</span>, <span style='cursor:w-resize;'>w-resize</span>, <span style='cursor:text;'>text</span>, <span style='cursor:wait;'>wait</span>, <span style='cursor:help;'>help</span>.<br><br>Hover over the options above to see the cursor.", ["other"]), formattingProp: true },
    { name: "overflow x", stylename: "overflowX", choices: ["visible", "hidden", "scroll", "auto"], help: pui.helpTextProperties("css", "Determines whether a horizontal scrollbar should be displayed for this element.", ["overflow"]), formattingProp: true },
    { name: "overflow y", stylename: "overflowY", choices: ["visible", "hidden", "scroll", "auto"], help: pui.helpTextProperties("css", "Determines whether a vertical scrollbar should be displayed for this element.", ["overflow"]), formattingProp: true },
    { name: "tab index", format: "number", attribute: "tabIndex", help: pui.helpTextProperties("blank", "Determines the tab order for input elements on the screen." + (context == "genie" ? " This property does not take effect unless the Prevent Auto Tab property is set to true under Screen Properties." : "")) },
    { name: "tool tip", type: "long", allowNewLines: true, attribute: "title", translate: true, help: pui.helpTextProperties("blank", "Defines the text to appear in a tool tip when the user hovers the mouse over this element.") },
    { name: "user defined data", multOccur: true, help: pui.helpTextProperties("blank", "Specifies user-defined general purpose data associated with the widget. To provide multiple user defined data values, right-click the property and select Add Another User Defined Value.") },
    { name: "visibility", format: "visible / hidden", stylename: "visibility", choices: ["hidden", "visible"], help: pui.helpTextProperties("blank", "Determines whether the element is visible or hidden. Hidden elements appear dimmed out in design mode, and invisible at runtime. If not defined, the CSS will determine the visibility, it will inherit its parent's visibility, or it will be visible.") },
    { name: "inline style", type: "long", allowNewLines: true, attribute: "style", help: pui.helpTextProperties("blank", "This property lets you define CSS properties that will be applied to the widget. These properties are applied inline, and therefore take precedence over those defined in a CSS class. Multiple properties may be provided, separated by a semi-colon. You can learn more about CSS properties at the following link: http://www.w3schools.com/cssref/. If you define CSS properties that are defined by other widget properties, the widget properties overrule the CSS inline properties. These CSS properties are ignored and should be set using the widget properties: 'position', 'visibility', 'display', 'left', 'right', 'top', 'bottom', 'width', 'height'") },

    { name: "Events", category: true },
    { name: "onblur", type: "js", help: pui.helpTextProperties("blank", "Initiates a client-side script when the element loses focus.") },
    { name: "onchange", type: "js", help: pui.helpTextProperties("blank", "Initiates a client-side script when the element value is changed.") },
    { name: "oninput", controls: ["combo box", "date field", "password field", "spinner", "text area", "textbox"], type: "js", help: pui.helpTextProperties("blank", "Initiates a client-side script immediately after any input is entered into the element without waiting for the element to lose focus.") },
    { name: "onclick", type: "js", help: pui.helpTextProperties("blank", "Initiates a client-side script when the element is clicked.") },
    { name: "ondblclick", type: "js", help: pui.helpTextProperties("blank", "Initiates a client-side script when the element is double-clicked.") },
    { name: "ondbload", controls: ["select box", "combo box", "textbox", "chart"], type: "js", help: pui.helpTextProperties("blank", "Initiates a client-side script when database data is loaded for a database-driven widget. An object named <b>response</b> will be defined that contains:<ul><li><b>success</b> - boolean true/false</li><li><b>id</b> - the widget id</li><li><b>error</b> - an object with 'id', 'text' and 'text2' fields containing the error.</li></ul>") },
    { name: "onfocus", type: "js", help: pui.helpTextProperties("blank", "Initiates a client-side script when the element receives focus.") },
    { name: "onkeydown", type: "js", help: pui.helpTextProperties("blank", "Initiates a client-side script when a keyboard key is being pressed down on this element.") },
    { name: "onkeypress", type: "js", help: pui.helpTextProperties("blank", "Initiates a client-side script when the user presses and releases a keyboard key on this element.") },
    { name: "onkeyup", type: "js", help: pui.helpTextProperties("blank", "Initiates a client-side script when the user releases a keyboard key on this element.") },
    { name: "onmousedown", type: "js", help: pui.helpTextProperties("blank", "Initiates a client-side script when the mouse is pressed down on this element.") },
    { name: "onmousemove", type: "js", help: pui.helpTextProperties("blank", "Initiates a client-side script when the mouse is moving within this element.") },
    { name: "onmouseout", type: "js", help: pui.helpTextProperties("blank", "Initiates a client-side script when the mouse is moved off this element.") },
    { name: "onmouseover", type: "js", help: pui.helpTextProperties("blank", "Initiates a client-side script when the mouse is moved over this element.") },
    { name: "onmouseup", type: "js", help: pui.helpTextProperties("blank", "Initiates a client-side script when the mouse button is released off this element.") },
    { name: "onoptiondisplay", type: "js", help: pui.helpTextProperties("blank", "Initiates a client-side script before options are displayed. The script can change the options if needed.  The options are passed to the event as a parameter named 'options'. The values are passed to the event as a parameter named 'values'."), controls: ["combo box"] },
    { name: "onselect", controls: ["combo box", "textbox"], type: "js", help: pui.helpTextProperties("blank", "Initiates a client-side script when a selection is made from the selection list of an auto-complete textbox or a combo box. In the case of an auto-complete textbox, the selected record is passed to the function as a JSON object that has properties named after the selected fields.") },
    { name: "onspin", controls: ["spinner"], type: "js", help: pui.helpTextProperties("blank", "Initiates a client-side script when the up or down arrow is clicked on a spinner element.") }
  ];

  //Remove remote server property if PJS. Not yet ready to implement.
  if (pui.nodedesigner === true) {
    var elemIndex = cachedPropertiesModel.map( function(elem) {
      return elem.name;
    }).indexOf("remote system name");

    cachedPropertiesModel.splice(elemIndex, 1);

  }

  return cachedPropertiesModel;
}

// Provides list of global screen properties and their definitions
function getScreenPropertiesModel(designScreen) {

  if (pui.codeBased) {
    var model = [
      { name: "Identification", category: true }, 
      { name: "record format name", help: pui.helpTextProperties("blank", "Identifies the screen name used by server-side code to read input or write output."), maxLength: 10, bind: false, canBeRemoved: false }, 
      { name: "description", help: pui.helpTextProperties("blank", "Describes the record format."), bind: false }, 
      { name: "document type", choices: ["html", "json", "xml", "text", "csv"], help: pui.helpTextProperties("blank", "Specifies the type of document used to define the record format. This determines the default content type and affects the syntax highlighting within the editor."), hideFormatting: true, validDataTypes: ["char", "varchar", "string"] }, 
      
      { name: "Input", category: true }, 
      { name: "input parameters", type: "inputfields", readOnly: true, bind: false, help: pui.helpTextProperties("bind", "Identifies input parameter names and the corresponding bound fields for the HTTP request."), relatedProperties: ["parameter name", "input field"], canBeRemoved: false }, 
      { name: "parameter name", label: "Parameter Name", multOccur: true, hide: true, bind: false, help: "" }, 
      { name: "input field", label: "Bound Field", hideFormatting: true, readOnly: true, multOccur: true, hide: true, help: "" },
      
      { name: "HTTP Header", category: true }, 
      { name: "content type", help: pui.helpTextProperties("[based on document type]", "Specifies an HTTP response content type. If not specified, a default content type based on the document type is used."), hideFormatting: true, validDataTypes: ["char", "varchar", "string"] }, 
      { name: "attachment name", help: pui.helpTextProperties("blank", "Specifies an attachment file name. When the attachment name is specified, the 'Content-Disposition: attachment' header is sent as part of the HTTP response."), hideFormatting: true, validDataTypes: ["char", "varchar", "string"] }, 
      { name: "no cache", choices: ["true", "false"], type: "boolean", help: pui.helpTextProperties("browser", "Specifies whether the 'Cache-Control: no-cache' HTTP header is sent, which causes the browser not to cache the response."), hideFormatting: true, validDataTypes: ["indicator", "expression"] }, 
      { name: "custom header", multOccur: true, type: "long", help: pui.helpTextProperties("[default headers]", "Specifies custom HTTP headers to send as part of the HTTP response."), hideFormatting: true, validDataTypes: ["char", "varchar", "string"] },
      
      { name: "Misc", category: true }, 
      { name: "separator", help: pui.helpTextProperties("blank", "Specifies an optional seperator value to output when multiple copies of this format are written. For example, if the format is to be written into a JSON array, the comma character should be specified as a separator."), bind: false }, 
      { name: "destination", help: pui.helpTextProperties("STDOUT", "Specifies an IFS path to send the output to. The file path is set on the first write to this record format, and cannot be changed without closing and re-opening the display file. If not specified, the output is sent to STDOUT."), hideFormatting: true, validDataTypes: ["char", "varchar", "string"] }, 
      { name: "existing file action", choices: ["append", "replace", "exception"], help: pui.helpTextProperties("exception", "Action to take if <i>destination</i> file already exists when the program starts writing this record format. 'append' will append to existing file content. 'replace' will delete/re-create the file. 'exception' will cause the handler to send an escape message to the program."), hideFormatting: true, validDataTypes: ["char", "varchar", "string"] }, 
      { name: "user defined data", multOccur: true, help: pui.helpTextProperties("blank", "Specifies user-defined general purpose data associated with the record format. To provide multiple user defined data values, right-click the property and select Add Another User Defined Value.") }
    ];
    return model;
  }

  if (context == "dspf") {
    var model = [
      { name: "Identification", category: true }, 
      { name: "record format name", displayName: (pui.nodedesigner ? "name" : undefined), help: pui.helpTextProperties("blank", "Identifies the name that is used to access this screen from server code."), maxLength: (pui.viewdesigner || pui.nodedesigner ? null : 10), bind: false, canBeRemoved: false }, 
      { name: "description", help: pui.helpTextProperties("blank", "Describes the screen."), bind: false }, 
      { name: "document title", help: pui.helpTextProperties("blank", "Specifies the document title to use when this screen is displayed. Web browsers usually display the document title in a window's title bar when the window is open, and in the task bar when the window is minimized.") },

      { name: "External Files", category: true }, 
      { name: "external css", type: "cssfile", multOccur: true, help: pui.helpTextProperties("blank", "Identifies the location of an external cascading style sheet file to apply to this screen. To specify multiple files, right-click the property and select Add Another External CSS.") }, 
      { name: "external javascript", type: "jsfile", multOccur: true, help: pui.helpTextProperties("blank", "Identifies the location of an external JavaScript file to load on this screen. To specify multiple files, right-click the property and select Add Another External JavaScript.") },

      { name: "Transition Animation", category: true }, 
      { name: "animated screen", choices: ["previous", "new"], help: pui.helpTextProperties("new", "Specifies whether the previous screen is animated away to reveal the new screen or the new screen is animated on top of the previous screen. The default is to animate the new screen.") }, 
      { name: "animation", choices: ["slide-right", "slide-left", "slide-down", "slide-up", "fade", "zoom-in", "zoom-out", "Other..."], help: pui.helpTextProperties("blank", "Identifies the CSS class for the screen transition animation. The 'animated screen' property is appended to the 'animation' property to select the appropriate CSS class.", ["other"]) }, 
      { name: "overlay screens", choices: ["true", "false"], type: "boolean", help: pui.helpTextProperties("false", "Determines if both the previous and the newly rendered screen should remain after the animation completes. This is useful in presenting a mobile pop-up menu screen or similar. Defaults to false.") },

      { name: "Overlay", category: true }, 
      { name: "overlay", choices: ["true", "false"], type: "boolean", help: pui.helpTextProperties("false", "Specifies that the screen you are defining should appear on the display without the entire display being cleared first."), hideFormatting: true, validDataTypes: ["indicator", "expression"], viewdesigner: false }, 
      { name: "overlay range", help: pui.helpTextProperties("blank", "Specifies a range of row numbers for this record format. This can be used to emulate certain behaviors of legacy green-screens in converted applications."), bind: false, viewdesigner: false }, 
      { name: "design overlay formats", type: "list", help: pui.helpTextProperties("blank", "Specifies a list of additional record formats to render in the designer when this record format is selected. This property is only used at design-time. It is ignored at run-time."), bind: false },

      { name: "Behavior", category: true }, 
      { name: "disable enter key", choices: ["true", "false"], type: "boolean", help: pui.helpTextProperties("false", "This property determines if pressing the Enter key will cause a response to be sent to the server. If set to true and the Enter key is not used as a shortcut key, the response will not be sent. Otherwise, the response is sent automatically."), hideFormatting: true, validDataTypes: ["indicator", "expression"] }, 
      { name: "initialize record", choices: ["true", "false"], type: "boolean", bind: false, help: pui.helpTextProperties("false", "Specifies that if this record is not already on the display, it is to be written to the display before an input operation is sent from the program. It represents the INZRCD keyword."), viewdesigner: false }, 
      { name: "protect", choices: ["true", "false"], type: "boolean", help: pui.helpTextProperties("false", "Specifies that when this record is displayed, all input-capable fields already on the display become protected. The read only property is set to true and the PR css class is applied."), hideFormatting: true, validDataTypes: ["indicator", "expression"] }, 
      { name: "erase formats", type: "eraseformats", readOnly: true, bind: false, help: pui.helpTextProperties("blank", "Identifies record formats to be erased when this record is written."), relatedProperties: ["erase format", "erase condition"], canBeRemoved: false, viewdesigner: false }, 
      { name: "erase format", label: "Record Format Name", maxLength: 10, uppercase: true, multOccur: true, hide: true, bind: false, help: "", viewdesigner: false }, 
      { name: "erase condition", label: "Erase Condition", validDataTypes: ["indicator", "expression"], hideFormatting: true, readOnly: true, multOccur: true, hide: true, format: "1 / 0", type: "boolean", help: "", viewdesigner: false }, 
      { name: "assume", choices: ["true", "false"], help: pui.helpTextProperties("false", "Use this property to specify that the program is to assume that a record is already shown on the display when this file is opened."), bind: false, viewdesigner: false }, 
      { name: "clear line", choices: ["*END", "*NO", "*ALL", "Other..."], help: pui.helpTextProperties("blank", "Use this property to clear (delete) a specific number of lines before the record is displayed. It represents the CLRL keyword.", ["other"]), bind: false, viewdesigner: false }, 
      { name: "starting line", help: pui.helpTextProperties("blank", "This property identifies the starting line of the record format. It is used in conjunction with 'clear line' property to specify where the clearing of lines begins. It represents the SLNO keyword."), bind: false, viewdesigner: false }, 
      { name: "put override", choices: ["true", "false"], type: "boolean", help: pui.helpTextProperties("false", "Use this property to override data contents or attributes of specific fields within a record. It represents the PUTOVR keyword."), hideFormatting: true, validDataTypes: ["indicator", "expression"], viewdesigner: false }, 
      { name: "override data", choices: ["true", "false"], type: "boolean", help: pui.helpTextProperties("false", "Use this property to together with the 'put override' property to override existing data contents already on the display. It represents the OVRDTA keyword."), hideFormatting: true, validDataTypes: ["indicator", "expression"], viewdesigner: false }, 
      { name: "override attribute", choices: ["true", "false"], type: "boolean", help: pui.helpTextProperties("false", "Use this property to together with the 'put override' property to override existing attributes already on the display. It represents the OVRATR keyword."), hideFormatting: true, validDataTypes: ["indicator", "expression"], viewdesigner: false }, 
      { name: "put retain", choices: ["true", "false"], type: "boolean", help: pui.helpTextProperties("false", "You use this property with the 'overlay' property to prevent the handler from deleting data that is already on the display when the application displays the record again. It represents the PUTRETAIN keyword."), hideFormatting: true, validDataTypes: ["indicator", "expression"], viewdesigner: false }, 
      { name: "return data", choices: ["true", "false"], type: "boolean", bind: false, help: pui.helpTextProperties("false", "Specifies that when your program sends an input operation to this record format, the program is to return the same data that was returned on the previous input operation sent to this record format. This property is ignored if the record format has not already been read. It represents the RTNDTA keyword."), viewdesigner: false },

      { name: "Response", category: true }, 
      { name: "changed", format: "1 / 0", readOnly: true, hideFormatting: true, validDataTypes: ["indicator"], help: pui.helpTextProperties("bind", "Specifies a response indicator that is set on if data on any input element within the record format is modified.") }, 
      { name: "set off", multOccur: true, format: "1 / 0", readOnly: true, hideFormatting: true, validDataTypes: ["indicator"], help: pui.helpTextProperties("bind", "Specifies response indicators that are to be set off. To specify additional set off indicators, right-click the property and select Add Another Set Off."), viewdesigner: false }, 
      { name: "valid command key", format: "1 / 0", readOnly: true, hideFormatting: true, validDataTypes: ["indicator"], help: pui.helpTextProperties("bind", "Specifies a response indicator that is set on when a response that is not associated with the Enter shortcut key is sent to the server."), viewdesigner: false }, 
      { name: "back button", format: "1 / 0", readOnly: true, hideFormatting: true, validDataTypes: ["indicator"], help: pui.helpTextProperties("bind", "Specifies a response indicator that is set on when the user presses the browser's back button. This feature will only work in browsers that support the HTML5 history.pushState() method.") },

      { name: "Messages", category: true }, 
      { name: "error messages", type: "errmessages", readOnly: true, bind: false, help: pui.helpTextProperties("blank", "Identifies error messages to be displayed in association with this element."), relatedProperties: ["error message", "error message id", "error message file", "error message library", "replacement data", "error condition", "error response", "error enhanced mode"], canBeRemoved: false }, 
      { name: "error message", label: "Message Text", multOccur: true, hide: true, help: "" }, 
      { name: "error message id", label: "Message Id", uppercase: true, maxLength: 7, multOccur: true, hide: true, help: "" }, 
      { name: "error message file", label: "Message File", maxLength: 10, uppercase: true, multOccur: true, hide: true, help: "" }, 
      { name: "error message library", label: "Library", maxLength: 10, uppercase: true, multOccur: true, hide: true, help: "" }, 
      { name: "replacement data", label: "Replacement Data", validDataTypes: ["char"], hideFormatting: true, readOnly: true, multOccur: true, hide: true, help: "" }, 
      { name: "error condition", label: "Error Condition", validDataTypes: ["indicator", "expression"], hideFormatting: true, readOnly: true, multOccur: true, hide: true, format: "1 / 0", type: "boolean", help: "" }, 
      { name: "error response", label: "Error Response", validDataTypes: ["indicator"], hideFormatting: true, readOnly: true, multOccur: true, hide: true, format: "1 / 0", type: "boolean", help: "" }, 
      { name: "error enhanced mode", label: "Enhanced Mode", checkbox: true, bind: false, multOccur: true, hide: true, help: pui.helpTextProperties("checked", "If checked, allows error messages to display without ERRMSG/ERRMSGID-type restrictions. Errors can display regardless of whether format is already on the screen, and output data is also sent.") },

      { name: "Help", category: true, viewdesigner: false }, 
      { name: "help titles", type: "helptitles", readOnly: true, bind: false, help: pui.helpTextProperties("blank", "Identifies the help title for the help panel. Multiple titles can be specified and conditioned using indicators."), relatedProperties: ["help title", "help title condition"], canBeRemoved: false, viewdesigner: false }, 
      { name: "help title", label: "Help Title", multOccur: true, bind: false, hide: true, help: "", viewdesigner: false }, 
      { name: "help title condition", label: "Condition", validDataTypes: ["indicator", "expression"], hideFormatting: true, readOnly: true, multOccur: true, hide: true, format: "1 / 0", type: "boolean", help: "", viewdesigner: false },

      { name: "help panels", type: "helppanels", readOnly: true, bind: false, help: pui.helpTextProperties("blank", "Identifies the help area and the specifc help record or help panel group to display when the help button is clicked."), relatedProperties: ["help record", "help display file", "help panel group", "help module", "help area", "help panel condition"], canBeRemoved: false, viewdesigner: false }, 
      { name: "help record", label: "Help Record", uppercase: true, maxLength: 10, multOccur: true, bind: false, hide: true, help: "", viewdesigner: false }, 
      { name: "help display file", label: "Help Display File", uppercase: true, maxLength: 21, multOccur: true, bind: false, hide: true, help: "", viewdesigner: false }, 
      { name: "help panel group", label: "Help Panel Group", uppercase: true, maxLength: 21, multOccur: true, bind: false, hide: true, help: "", viewdesigner: false }, 
      { name: "help module", label: "Help Module", uppercase: true, maxLength: 32, multOccur: true, bind: false, hide: true, help: "", viewdesigner: false }, 
      { name: "help area", label: "Help Area", multOccur: true, bind: false, hide: true, help: "", viewdesigner: false }, 
      { name: "help panel condition", label: "Condition", validDataTypes: ["indicator", "expression"], hideFormatting: true, readOnly: true, multOccur: true, hide: true, format: "1 / 0", type: "boolean", help: "", viewdesigner: false },

      { name: "Window", category: true }, 
      { name: "show as window", choices: ["true", "false"], type: "boolean", help: pui.helpTextProperties("false", "Determines whether this screen is shown as a pop-up window."), hideFormatting: true, validDataTypes: ["indicator", "expression"] }, 
      { name: "window left", format: "px", help: pui.helpTextProperties("blank", "Represents the x-coordinate of the window. Can be expressed in pixels or columns.") }, 
      { name: "window top", format: "px", help: pui.helpTextProperties("blank", "Represents the y-coordinate of the window. Can be expressed in pixels or rows.") }, 
      { name: "center window", choices: ["true", "false"], type: "boolean", help: pui.helpTextProperties("false", "If set to true, the window will be centered within the boundaries of the previously rendered screen."), hideFormatting: true, validDataTypes: ["indicator", "expression"] }, 
      { name: "mask screen", choices: ["true", "false"], type: "boolean", help: pui.helpTextProperties("true", "Determines if the screen is masked when a window is displayed. Defaults to true."), hideFormatting: true, validDataTypes: ["indicator", "expression"] }, 
      { name: "remove windows", choices: ["true", "false"], type: "boolean", help: pui.helpTextProperties("false", "Specify this property to remove all existing windows on the display before this window is displayed."), hideFormatting: true, validDataTypes: ["indicator", "expression"], viewdesigner: false }, 
      { name: "window reference", help: pui.helpTextProperties("blank", "Use this property to refer to a record format name where the window and its properties have been defined."), maxLength: 10, bind: false, viewdesigner: false },

      { name: "Cursor Location", category: true }, 
      { name: "return cursor record", readOnly: true, hideFormatting: true, validDataTypes: ["char", "varchar", "string"], help: pui.helpTextProperties("bind", "This property can be bound to a character field, which will be used to receive the name of the record format or screen on which the cursor is located.") }, 
      { name: "return cursor field", readOnly: true, hideFormatting: true, validDataTypes: ["char", "varchar", "string"], help: pui.helpTextProperties("bind", "This property can be bound to a character field, which will be used to receive the name of the field on which the cursor is located.") }, 
      { name: "return cursor position", readOnly: true, format: "number", hideFormatting: true, validDataTypes: ["zoned"], help: pui.helpTextProperties("bind", "This property can be bound to a numeric field, which will be used to reveive the relative position of the cursor within an element.") }, 
      { name: "return cursor row", readOnly: true, format: "number", hideFormatting: true, validDataTypes: ["zoned"], help: pui.helpTextProperties("bind", "This property can be bound to a numeric field, which will contain the row on which the cursor is located. The row number is based on the <i>cursor row</i> property assigned to the widgets on the screen."), viewdesigner: false }, 
      { name: "return cursor column", readOnly: true, format: "number", hideFormatting: true, validDataTypes: ["zoned"], help: pui.helpTextProperties("bind", "This property can be bound to a numeric field, which will contain the column on which the cursor is located. The column number is based on the <i>cursor column</i> property assigned to the widgets on the screen."), viewdesigner: false }, 
      { name: "set cursor condition", readOnly: true, hideFormatting: true, validDataTypes: ["indicator", "expression"], format: "true / false", help: pui.helpTextProperties("bind", "This property can provide an indicator condition, which will be used to determine whether the <i>set cursor row</i> and <i>set cursor column</i> properties are used to set focus."), viewdesigner: false }, 
      { name: "set cursor row", format: "number", hideFormatting: true, validDataTypes: ["zoned"], help: pui.helpTextProperties("blank", "This property is used to set focus on a specific widget by identifying the widget's assigned cursor row and cursor column properties."), viewdesigner: false }, 
      { name: "set cursor column", format: "number", hideFormatting: true, validDataTypes: ["zoned"], help: pui.helpTextProperties("blank", "This property is used to set focus on a specific widget by identifying the widget's assigned cursor row and cursor column properties."), viewdesigner: false }, 
      { name: "no focus", choices: ["true", "false", "no focus on page"], type: "boolean", help: pui.helpTextProperties("false", "This property indicates that no field should receive focus when the screen first renders. When set to 'true', focus will not go to any input element, but key presses (such as for function keys) will still be detected by the application without any special action from the user.<br /><br />When set to 'no focus on page', no input element will get focus, but key presses will not be detected by the application until the user clicks on a component in the screen. This setting is useful to prevent Internet Explorer from taking focus away from another open window when the screen is rendered."), hideFormatting: true, validDataTypes: ["indicator", "expression"] },

      { name: "Drag and Drop Response", category: true }, 
      { name: "dd element id", readOnly: true, hideFormatting: true, validDataTypes: ["char", "varchar", "string"], help: pui.helpTextProperties("bind", "This property can be bound to a character field, which will be used to retrieve the id of the element that is drag and dropped.") }, 
      { name: "dd record number", readOnly: true, format: "number", hideFormatting: true, validDataTypes: ["zoned"], help: pui.helpTextProperties("bind", "This property can be bound to a numeric field, which will be used to retrieve the record number of the subfile row that is drag and dropped.") }, 
      { name: "target element id", readOnly: true, hideFormatting: true, validDataTypes: ["char", "varchar", "string"], help: pui.helpTextProperties("bind", "This property can be bound to a character field, which will be used to retrieve the id of the target element in a drag and drop operation. Use this property to determine where an element was dropped.") }, 
      { name: "target record number", readOnly: true, format: "number", hideFormatting: true, validDataTypes: ["zoned"], help: pui.helpTextProperties("bind", "This property can be bound to a numeric field, which will be used to retrieve the record number of the target subfile row in a drag and drop operation. Use this property to determine where within a subfile an element was dropped.") }, 
      { name: "bypass validation", choices: ["true", "false", "send data"], type: "boolean", help: pui.helpTextProperties("false", "This property specifies that a drag and drop operation will not trigger client-side validation and will automatically discard all data modified by the user on the screen. You can select 'send data' to bypass all client-side validation except for field data type validation and still send all data modified by the user."), validDataTypes: ["char", "indicator", "expression"] },

      { name: "Events", category: true }, 
      { name: "onload", type: "js", help: pui.helpTextProperties("blank", "Initiates a client-side script when the screen loads.") }, 
      { name: "onsubmit", type: "js", help: pui.helpTextProperties("blank", "Initiates a client-side script or expression before a response is submitted to the screen. This typically occurs when a button or a hyperlink is clicked. If the expression evaluates to <i>false</i>, the response is not submitted.") }, 
      { name: "onmessage", type: "js", help: pui.helpTextProperties("blank", "Initiates a client-side script that receives a message from the Profound.js display.screen.write(), display.screen.execute(), or the display.screen.executeMessage() API, which allows you to partially update screen content instead of re-rendering the entire screen. The message is received in a variable named <b>message</b>.") },

      { name: "Misc", category: true }, 
      { name: "user defined data", multOccur: true, help: pui.helpTextProperties("blank", "Specifies user-defined general purpose data associated with the screen. To provide multiple user defined data values, right-click the property and select Add Another User Defined Value.") }

    ];
    return model;
  }

  if (designScreen.isWindow == true) {
    var model = [
      { name: "Identification", category: true }, 
      { name: "screen name", help: pui.helpTextProperties("[blank or matched screen name]", "The screen name is used to save the current screen to the server. The screen is saved to a .scn file under the selected skin. In addition to specifying a screen name, you will have to mark one or more fields as screen identifiers."), canBeRemoved: false }, 
      
      { name: "Window Subfile Options", category: true }, 
      { name: "create combo boxes", variable: "pui.genie.config.createComboBoxesInWindow", choices: ["true", "false"], type: "boolean", help: pui.helpTextProperties("false", "<i>Default = false</i>.<br> This flag determines whether the option column will be converted to a combo box when a subfile is detected in a window format. Due to the limited amount of space in a window format, this can overflow the window, so it is disabled by default.") }, 
      
      { name: "Events", category: true }, 
      { name: "onpageload", type: "js", help: pui.helpTextProperties("blank", "Initiates a client-side script when the page loads but before screen design customizations are applied.") }, 
      { name: "onload", type: "js", help: pui.helpTextProperties("blank", "Initiates a client-side script when the screen loads.") }
    ];
    return model;
  }

  var model = [
    { name: "Identification", category: true },
    { name: "screen name", help: pui.helpTextProperties("[blank or matched screen name]", "The screen name is used to save the current screen to the server. The screen is saved to a .scn file under the selected skin. In addition to specifying a screen name, you will have to mark one or more fields as screen identifiers."), canBeRemoved: false },

    { name: "Subfile Options", category: true },
    { name: "detect subfile", variable: "pui.genie.config.detectSubfile", choices: ["true", "false"], type: "boolean", help: pui.helpTextProperties("true", "This flag determines whether Genie should look for a subfile on the current screen.") },
    { name: "detect subfile patterns", variable: "pui.genie.config.detectSubfilePatterns", choices: ["true", "false"], type: "boolean", help: pui.helpTextProperties("true", "This flag tells Genie to look for a subfile by detecting a pattern of rows that are formatted in the same way. When a subfile is detected using this method, a grid widget is created over it. If the flag is not set to true, Genie looks for Option Headings, instead, in order to detect the subfile.") },
    { name: "detect subfile end plus", variable: "pui.genie.config.detectSubfileEndPlus", choices: ["true", "false"], type: "boolean", help: pui.helpTextProperties("true", "When 'detect subfile patterns' is selected, this flag will allow Genie to recognize a 1A output field usually containing a '+' on the end of the last row, and remove it so it will not interrupt the pattern detection.") },
    { name: "find option column", variable: "pui.genie.config.findOptionColumn", choices: ["true", "false"], type: "boolean", help: pui.helpTextProperties("true", "When 'detect subfile patterns' is selected, this flag is used to prevent false positives by only creating grids on subfiles where an Option Column exists.") },
    { name: "option headings", type: "list", variable: "pui.genie.config.optionHeadings", help: pui.helpTextProperties("true", "Specifies a comma separated list of headings to look for to identify a subfile option column. This method of detecting subfiles is used only when the 'detect subfile patterns' option is not selected.") },
    { name: "subfile start", variable: "pui.genie.config.subfileStartLine", choices: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27], help: pui.helpTextProperties("blank", "Subfile start and subfile end properties specify the row numbers where the screen's subfile starts and ends. This explicitly overrides all subfile detection.") },
    { name: "subfile end", variable: "pui.genie.config.subfileEndLine", choices: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27], help: pui.helpTextProperties("blank", "Subfile start and subfile end properties specify the row numbers where the screen's subfile starts and ends. This explicitly overrides all subfile detection.") },
    { name: "outline subfile", variable: "pui.genie.config.outlineSubfile", choices: ["true", "false"], type: "boolean", help: pui.helpTextProperties("skin", "If a subfile is found using the Option Headings method, this flag determines whether an outline is drawn around the subfile area.") },
    { name: "subfile outline color", variable: "pui.genie.config.subfileOutlineColor", type: "color", help: pui.helpTextProperties("skin", "Sets the outline color when the 'outline subfile' option is used. This can be give either as a CSS color name, such as 'red', or as a hex code, such as '#FF0000'.") },
    { name: "separate subfile lines", variable: "pui.genie.config.separateSubfileLines", choices: ["true", "false"], type: "boolean", help: pui.helpTextProperties("skin", "If a subfile is found using the Option Headings method, this flag determines whether a separator line is drawn between each subfile line.") },
    { name: "hide subfile options", variable: "pui.genie.config.hideSubfileOpt", choices: ["true", "false"], type: "boolean", help: pui.helpTextProperties("skin", "If a subfile is found using the Option Headings method, this flag tells Genie to find and hide an option input box on each subfile line. Instead of using the input box, the user will be able to right-click the subfile to select the appropriate option.") },
    { name: "row highlight color", variable: "pui.genie.config.hiColor", type: "color", help: pui.helpTextProperties("skin", "Defines the color of the row when it is hovered over with the mouse.", ["background color"]) },
    { name: "row highlight font color", variable: "pui.genie.config.hiFontColor", type: "color", help: pui.helpTextProperties("skin", "Defines the color of the text within the row when the row is hovered over with the mouse.", ["color"]) },
    { name: "striped subfile", variable: "pui.genie.config.stripedSubfile", choices: ["true", "false"], type: "boolean", help: pui.helpTextProperties("skin", "This flag determines if the subfile rows are striped with alternate colors.") },
    { name: "odd row color", variable: "pui.genie.config.oddRowColor", type: "color", help: pui.helpTextProperties("skin", "The color of the odd rows in a striped subfile.", ["background color"]) },
    { name: "even row color", variable: "pui.genie.config.evenRowColor", type: "color", help: pui.helpTextProperties("skin", "The color of the even rows in a striped subfile.", ["background color"]) },

    { name: "Misc", category: true },
    { name: "alert errors", variable: "pui.genie.config.alertErrors", choices: ["true", "false"], type: "boolean", help: pui.helpTextProperties("false", "When set to true, Genie presents green-screen errors in an alert box. When set to false, errors are displayed at the bottom of the screen only.") },
    { name: "detect menus", variable: "pui.genie.config.detectMenus", choices: ["true", "false"], type: "boolean", help: pui.helpTextProperties("true", "When set to true, Genie looks for menu panels on this screen and and transforms the menu options into hyperlinks.") },
    { name: "detect date fields", variable: "pui.genie.config.detectDateFields", choices: ["true", "false"], type: "boolean", help: pui.helpTextProperties("false", "When set to true, Genie looks for date fields on this screen and automatically attaches a calendar control to any field that it finds.") },
    { name: "default date format", variable: "pui.genie.config.defaultDateFormat", choices: ["MM/DD/YY", "MM/DD/YYYY", "DD/MM/YY", "DD/MM/YYYY", "DD.MM.YY", "DD.MM.YYYY", "MMDDYY", "MMDDYYYY", "DDMMYY", "DDMMYYYY", "YYMMDD", "YYYYMMDD", "YYYY-MM-DD", "YYYY/MM/DD"], help: pui.helpTextProperties("MM/DD/YY", "Defines the default date format to be used in calendar controls.") },
    { name: "enlarge headings", variable: "pui.genie.config.enlargeHeadings", choices: ["true", "false"], type: "boolean", help: pui.helpTextProperties("skin", "When set to true, Genie looks for the screen heading and automatically increases its font size and adds a shadow.") },
    { name: "function key buttons", variable: "pui.genie.config.functionKeyButtons", choices: ["true", "false"], type: "boolean", help: pui.helpTextProperties("skin", "This flag determines whether function key labels, such as 'F3=Exit', are transformed into buttons.") },
    { name: "hide function key names", variable: "pui.genie.config.hideFKeyNames", choices: ["true", "false"], type: "boolean", help: pui.helpTextProperties("skin", "This flag looks for function key labels and removes the function key name. For example, 'F3=Exit' becomes 'Exit'. The user will be able to click on the field to send the appropriate function key to the server.") },
    { name: "overtype mode", variable: "pui.genie.config.overtypeMode", choices: ["true", "false"], type: "boolean", help: pui.helpTextProperties("true", "Determines if the default keyboard cursor mode is overtype or insert. In overtype mode, the characters you type replace existing characters one by one. In insert mode, the characters you type move existing text to the right.", null, "This feature is only available in Internet Explorer. Other browsers no longer allow overtype mode.") },
    { name: "highlight on focus", variable: "pui.genie.config.highlightOnFocus", choices: ["true", "false"], type: "boolean", help: pui.helpTextProperties("false", "Highlights text in input fields when focus is received.") },
    { name: "prevent auto tab", variable: "pui.genie.config.preventAutoTab", choices: ["true", "false"], type: "boolean", help: pui.helpTextProperties("false", "If set to false, Genie overrides the browser's default behavior of the Tab key with its own automatic tabbing. If set to true, the browser's default behavior is used for tabbing.") },
    { name: "set field background color", variable: "pui.genie.config.setFieldBackground", choices: ["true", "false"], type: "boolean", help: pui.helpTextProperties("false", "If set to true, Genie will set the background color of all fields to the match the main screen background color, preventing any underlying items from showing through. If set to false, all fields will be given a transparent background, allowing any underlying items to show through.") },
    { name: "use fixed font", variable: "pui.genie.config.useFixedFont", choices: ["true", "false"], type: "boolean", help: pui.helpTextProperties("false", "If set to true, Genie will set the font for this screen to Monospace. If set to false, Genie will use the font specified in the style sheet for this skin.") },
    { name: "adjust window borders", variable: "pui.genie.config.adjustWindowBorders", choices: ["true", "false"], type: "boolean", help: pui.helpTextProperties("true", "When set to true, Genie will adjust the position and height of reverse image/space window borders in order to prevent gaps in the border.") },
    
    { name: "Events", category: true },
    { name: "onpageload", type: "js", help: pui.helpTextProperties("blank", "Initiates a client-side script when the page loads but before screen design customizations are applied.") },
    { name: "onload", type: "js", help: pui.helpTextProperties("blank", "Initiates a client-side script when the screen loads including all screen design customizations.") },
    { name: "onsubmit", type: "js", help: pui.helpTextProperties("blank", "Initiates a client-side script or expression before a response is submitted to the screen. This typically occurs when a function key is pressed or a button/hyperlink is clicked. If the expression evaluates to <i>false</i>, the response is not submitted.") },
    { name: "subfile row onclick", type: "js", help: pui.helpTextProperties("blank", "Initiates a client-side script when a subfile row is clicked. The JavaScript variable hiLine reports the line that is currently highlighted. This event only fires when the 'detect subfile patterns' option is not selected.") },
    { name: "subfile row ondblclick", type: "js",help: pui.helpTextProperties("blank", "Initiates a client-side script when a subfile row is double-clicked. The JavaScript variable hiLine reports the line that is currently highlighted. This event only fires when the 'detect subfile patterns' option is not selected.") }
  ];

  return model;
}


// Turn a model from an array to an object that you can access by property name
function makeNamedModel(model) {
  var namedModel = {};
  for (var i = 0; i < model.length; i++) {
    namedModel[model[i].name] = model[i];
    if (model[i].displayName) {
      pui.propertyAlias[model[i].displayName] = model[i].name;
    }
  }
  return namedModel;
}



function getPropertiesNamedModel() {
  if (cachedPropertiesNamedModel != null) return cachedPropertiesNamedModel;
  cachedPropertiesNamedModel = makeNamedModel(getPropertiesModel());
  return cachedPropertiesNamedModel;
}


// API used to apply property values in customization scripts
function applyDesignProperty(domObj, propertyName, propertyValue) {

  // if an alias name ("display name") was used, revert it to the "real" name.
  if (pui.propertyAlias[propertyName]) propertyName = pui.propertyAlias[propertyName];

  // Accept either DOM object or id.
  if (typeof (domObj) == "string") domObj = getObj(domObj);

  if (domObj == null) return null;

  if (propertyName == "shortcut key") {
    pui.assignShortcutKey(propertyValue, domObj);
  }
  if (propertyName == "focus class") {
    if (domObj["pui"]["properties"]["field type"] === "combo box") {
      var box = domObj.comboBoxWidget.getBox();
      box.focusClass = trim(propertyValue);
      addEvent(box, "focus", pui.applyFocusClass);
      addEvent(box, "blur", pui.removeFocusClass);
    } else {
      domObj.focusClass = trim(propertyValue);
      addEvent(domObj, "focus", pui.applyFocusClass);
      addEvent(domObj, "blur", pui.removeFocusClass);
    }
  }
  if (propertyName == "required") {
    domObj.puirequired = (propertyValue == "true");
  }
  if (propertyName == "mandatory entry") {
    domObj.ME = (propertyValue == "true");
  }
  if (propertyName == "mandatory fill") {
    domObj.MF = (propertyValue == "true");
  }
  if (propertyName == "valid values") {
    domObj.validValues = propertyValue;
  }
  if (propertyName == "allow blanks") {
    domObj.allowBlanks = (propertyValue == "true");
  }
  if (propertyName == "auto advance") { // to do
    var boxDom = domObj;
    if (domObj.comboBoxWidget != null) boxDom = domObj.comboBoxWidget.getBox();
    if (propertyValue == "true") {
      boxDom.autoAdvance = true;
      addEvent(boxDom, "keyup", pui.autoAdvanceOnKeyUp);
    } else {
      boxDom.autoAdvance = true;
      removeEvent(boxDom, "keyup", pui.autoAdvanceOnKeyUp);
    }
  }
  if (propertyName == "validate name") {
    domObj.validateName = (propertyValue == "true");
  }
  if (propertyName == "validate email") {
    domObj.validateEmail = (propertyValue == "true");
  }
  if (propertyName == "comparison operator") {
    domObj.compOperator = (propertyValue == "true");
  }
  if (propertyName == "comparison value") {
    domObj.compValue = propertyValue;
  }
  if (propertyName == "range low") {
    domObj.rangeLow = propertyValue;
  }
  if (propertyName == "range high") {
    domObj.rangeHigh = propertyValue;
  }
  if (propertyName == "checked value") {
    domObj.checkedValue = propertyValue;
  }
  if (propertyName == "unchecked value") {
    domObj.uncheckedValue = propertyValue;
  }
  if (propertyName == "bypass validation") {
    domObj.bypassValidation = propertyValue;
  }
  if (propertyName == "set focus" && (propertyValue == true || propertyValue == "true")) {
    var dom = domObj;
    if (dom.comboBoxWidget != null) dom = dom.comboBoxWidget.getBox();
    dom.focus();
    pui.focusField.dom = dom;
    pui.focusField.setFocusFlag = true;
  }


  var nmodel;
  if (domObj.propertiesNamedModel == null) nmodel = getPropertiesNamedModel();
  else nmodel = domObj.propertiesNamedModel;
  var propConfig = nmodel[propertyName];
  if (propConfig == null) {
    // Get the multOccur property config.
    propConfig = pui.getPropConfig(nmodel, propertyName);
  }
  if (propConfig != null) {
    if (domObj["pui"] == null || domObj["pui"]["properties"] == null) {
      var value = "";
      var fieldType = "output field";
      if (domObj.tagName == "DIV") {
        value = getInnerText(domObj);
      }
      if (domObj.tagName == "INPUT") {
        value = domObj.value;
        fieldType = "textbox";
        if (domObj.type == "button" || domObj.type == "submit") fieldType = "button";
      }
      if (propertyName == "field type") fieldType = propertyValue;
      if (domObj["pui"] == null) domObj["pui"] = {};
      domObj["pui"]["properties"] = {
        "field type": fieldType,
        "value": value
      };
    }
    domObj["pui"]["properties"][propertyName] = propertyValue;
    var returnObj = applyPropertyToField(propConfig, domObj["pui"]["properties"], domObj, propertyValue, false);
    return returnObj;
  }
}

// Applies property value to field in design mode or at run-time
function applyPropertyToField(propConfig, properties, domObj, newValue, isDesignMode, designItem, resizer, subfileRow) {

  if (context === "genie" && domObj.id.match(/^subfile-scrollbar-[0-9]+(_W[0-9]+)*$/) && propConfig.name === "field type")
    return domObj;

  if (newValue == "Other..." && isDesignMode && propConfig.name != "value") return domObj;

  var dom = domObj;

  // Calculate Effective Value, set changed flag
  var originalValue;
  if (isDesignMode) {
    originalValue = designItem.originalValue;
    designItem.changed = true;
  } else {
    if (properties.originalValue != null) {
      originalValue = properties.originalValue;
    } else {
      if (domObj.tagName == "DIV") {
        if (domObj.comboBoxWidget != null) originalValue = domObj.comboBoxWidget.getValue();
        else if (domObj.slider != null) originalValue = domObj.slider.value;
        else originalValue = getInnerText(domObj);
      } else {
        originalValue = domObj.value;
      }
      properties.originalValue = originalValue;
    }
  }
  var effectiveValue = evalPropertyValue(newValue, originalValue, domObj);
  var propConfigName = propConfig.name;

  // Process change in field type
  var widget;
  var newDomObj;
  if (propConfigName == "field type") {
    widget = pui.widgets[effectiveValue];
    if (widget == null) return dom;
    var tag = widget.tag;
    var inpType = widget.inputType;

    switch (effectiveValue) {
      //case "button":
      //  // when switching an element to be a button, enforce default cursor
      //  if (isDesignMode) {
      //    if (!pui.isBound(designItem.properties["cursor"])) {
      //      designItem.properties["cursor"] = "default";
      //      designItem.propertiesChanged["cursor"] = true;
      //    }
      //  }
      //  break;
      case "select box":
        // protected field will not be turned into a select box
        if (!isDesignMode && domObj.readOnly && domObj.tagName == "INPUT") {
          switch (pui.genie.config["protectedSelectBox"]) {
            case "disable":
              domObj.disabled = true;
              break;
            case "output":
            default:
              tag = "input";
              inpType = domObj.type;
          }
        }
        if (isDesignMode && pui["is_old_ie"] && pui["ie_mode"] == 6 &&
          (String(designItem.properties["select box height"]) == "" ||
            String(designItem.properties["select box height"]) == "1" ||
            String(designItem.properties["select box height"]) == "undefined")) {
          tag = "input";
          inpType = "text";
        }
        break;
    }

    var rebuildCSSAttr = false;
    var reassigModifiedEvents = false;

    // Rebuild the object if tag is different, or if the input tag type is changing.
    var mismatch = (domObj.tagName.toLowerCase() != tag);
    if (!mismatch && domObj.tagName.toLowerCase() == "input") {
      if (domObj.type != inpType) {
        mismatch = true;
        if (domObj.type == "number" && inpType == "text") mismatch = false;
      }
    }
    //if (domObj.tagName.toLowerCase() != tag || (domObj.tagName.toLowerCase() == "input" && domObj.type != inpType)) {
    if (mismatch) {
      rebuildCSSAttr = true;
      newDomObj = document.createElement(tag);
      if (tag == "input" || (!pui["is_old_ie"] && tag == "button")) newDomObj.type = inpType;
      if (domObj.parentNode != null) domObj.parentNode.replaceChild(newDomObj, domObj);
      newDomObj.style.left = domObj.style.left;
      newDomObj.style.top = domObj.style.top;
      newDomObj.style.width = domObj.style.width;
      newDomObj.style.height = domObj.style.height;
      newDomObj.style.position = domObj.style.position;
      newDomObj.style.cursor = domObj.style.cursor;
      newDomObj.style.visibility = domObj.style.visibility;
      newDomObj.id = domObj.id;
      if (typeof domObj.name == "string")
        newDomObj.name = domObj.name;
      if (context == "dspf") {
        if (newDomObj["pui"] == null) newDomObj["pui"] = {};

        if (domObj.cursorRecord != null) {
          newDomObj.cursorRecord = domObj.cursorRecord;
          newDomObj["pui"]["formatName"] = domObj.cursorRecord; //Expose format name for custom widgets. #3440.
        }
        if (domObj.cursorField != null) {
          newDomObj.cursorField = domObj.cursorField;
          newDomObj["pui"]["fieldName"] = domObj.cursorField;
        }
      }
      if (context == "genie") {
        newDomObj.fieldInfo = domObj.fieldInfo;
        if (pui.genie.focusField == domObj) pui.genie.focusField = newDomObj;
        reassigModifiedEvents = true;
      }
      // Carry over "hide" class, if present.
      if (domObj.className.indexOf("hide") != -1) {
        newDomObj.className = "hide";
        if (isDesignMode) {
          newDomObj.style.visibility = "visible";
          newDomObj.style.filter = "alpha(opacity=30)";
          newDomObj.style.opacity = 0.30;
        }
      }
      // Carry over maxlength attribute, if present.
      if (domObj.getAttribute("maxlength") != null) {
        newDomObj.setAttribute("maxlength", domObj.getAttribute("maxlength"));
      }
      // Carry over disabled attribute
      newDomObj.disabled = domObj.disabled;
      // Carry over tab panel related fields
      if (domObj.parentTabPanel != null) newDomObj.parentTabPanel = domObj.parentTabPanel;
      if (domObj.parentTab != null) newDomObj.parentTab = domObj.parentTab;

      // Carry over bound SQL property flag.
      if (domObj.hasBoundSQLProps) newDomObj.hasBoundSQLProps = true;

      if (context == "genie") {
        attachInputEvents(newDomObj);
      }
      if (isDesignMode) {
        designItem.dom = newDomObj;
        if (resizer != null) resizer.attachTo(designItem);
        designItem.designer.attachMouseDownEvent(newDomObj, designItem);
      }
      if (domObj.readOnly) {
        if (tag == "input") {
          if (newDomObj.type == "checkbox" || newDomObj.type == "radio") {
            if (context == "genie") {
              addEvent(newDomObj, "click", disableInputControl);
            }
          }
        } else if (tag == "textarea") {
          newDomObj.readOnly = true;
        }
      }
    } else {
      newDomObj = domObj;
      if (tag == "div" && effectiveValue != "tab panel") newDomObj.tabPanel = null; // in case element used to be a tab panel, deactivate all tab panel functionality
      if (isDesignMode || effectiveValue == "chart" || effectiveValue == "radio button") rebuildCSSAttr = true;
    }

    // set all css and attribute properties
    if (rebuildCSSAttr) {
      var model = getPropertiesModel();
      for (var i = 0; i < model.length; i++) {
        var propName = model[i].name;
        var propValue = properties[propName];
        if (propValue != null && propValue != "") {
          var isStyleProp = (model[i].stylename != null);
          if (propName == "overflow x" || propName == "overflow y") {
            if (properties["field type"] == "layout") isStyleProp = false;
          }
          if (isStyleProp) {
            if (model[i].stylename == "visibility" && isDesignMode) {
              if (propValue == "hidden") {
                newDomObj.style.filter = "alpha(opacity=30)";
                newDomObj.style.opacity = 0.30;
              } else {
                newDomObj.style.filter = "";
                newDomObj.style.opacity = "";
              }
            } else {
              try {
                var posdim = pui.getPosDimString(model[i].stylename, propValue);
                newDomObj.style[model[i].stylename] = posdim;

                // To allow inline-style setting and removing, cache the style property.
                if (isDesignMode)
                  pui.cacheStyle(newDomObj, model[i].stylename, posdim);
              } catch (e) {}
            }
          }
          if (model[i].attribute != null) {
            if (model[i].type == "boolean" && propValue == "true") propValue = true;
            if (model[i].type == "boolean" && propValue == "false") propValue = false;
            if (model[i].attribute == "disabled" && isDesignMode) propValue = false;
            //try { newDomObj[model[i].attribute] = propValue }
            try {
              if (propValue == false) {
                if (newDomObj.getAttribute(model[i].attribute) != null) {
                  newDomObj.removeAttribute(model[i].attribute);
                }
              } else {
                var valueToAssign = evalPropertyValue(propValue, originalValue, newDomObj);
                if (model[i].attribute == "src") valueToAssign = pui.normalizeURL(valueToAssign, true);
                // Set the attribute if it is not "inline style", which is set
                // later in the function.
                if (model[i].attribute !== "style") {
                  newDomObj.setAttribute(model[i].attribute, valueToAssign);
                }
                if (model[i].attribute == "class") {
                  newDomObj.className = propValue;
                }
              }
            } catch (e) {}
          }
        }
      }
    }
    if (context == "dspf") {
      var classes = [];
      classes.push(properties["css class"]);
      var clsNum = 2;
      var cls = properties["css class " + clsNum];
      while (cls != null) {
        classes.push(cls);
        clsNum++;
        cls = properties["css class " + clsNum];
      }
      var attr = properties["display attribute field"];
      var dspAtrField = false;
      if (attr != null && !pui.isBound(attr) && attr != "" && attr != " ") {
        classes = classes.concat(pui.attrToCSS(attr));
        dspAtrField = true;
      }
      assignDomClasses(newDomObj, classes, dspAtrField);
    }
    dom = newDomObj;
    if (!widget.resizable) {
      dom.style.width = "";
      dom.style.height = "";
    }
  } else {
    widget = pui.widgets[properties["field type"]];
    if (widget == null) return dom;
  }

  // make properties accessible by custom JavaScript at runtime
  if (dom["pui"] == null) dom["pui"] = {};
  if (dom["pui"]["properties"] == null) dom["pui"]["properties"] = {};
  dom["pui"]["properties"][propConfigName] = effectiveValue;

  if (propConfigName == "value" && newValue != "script: value" && !isDesignMode && context == "genie" && dom.fieldInfo != null && dom.fieldInfo["idx"] != null) {
    if (!(dom.tagName == "INPUT" && dom.type == "radio" && dom.checked != true)) {
      pui.response[dom.fieldInfo["idx"]] = dom;
    }
  }

  if (isDesignMode && propConfigName == "screen identifier" && context == "genie") {
    var borderColor = "red";
    if (newValue == "true" || newValue == true) borderColor = "red";
    else borderColor = "#cccccc";
    if (dom.style.borderLeftStyle == "dotted") dom.style.borderLeftColor = borderColor;
    if (dom.style.borderRightStyle == "dotted") dom.style.borderRightColor = borderColor;
    if (dom.style.borderTopStyle == "dotted") dom.style.borderTopColor = borderColor;
    if (dom.style.borderBottomStyle == "dotted") dom.style.borderBottomColor = borderColor;
  }


  // Execute widget's property setter methods
  var globalSetter = widget.globalPropertySetter;
  var setters = widget.propertySetters;
  var setter = null;
  if (setters != null) {
    setter = setters[propConfigName];
  }
  var setterParms;
  if (setter != null || globalSetter != null) {
    setterParms = {
      newValue: newValue,
      value: effectiveValue,
      design: isDesignMode,
      properties: properties,
      originalValue: originalValue,
      dom: dom,
      oldDom: domObj,
      propertyName: propConfigName,
      designItem: designItem,
      resizer: resizer,
      evalProperty: function (propName) {
        return evalPropertyValue(this.properties[propName], this.originalValue, this.dom);
      }
    };
  }
  if (globalSetter != null) {
    if (globalSetter(setterParms) == false) return;
  }
  if (setter != null) {
    if (setter(setterParms) == false) return;
  }

  if (reassigModifiedEvents) {
    if (newDomObj.comboBoxWidget != null) {
      var box = newDomObj.comboBoxWidget.getBox();
      pui.assignModifiedEvents(box);
      box.fieldInfo = newDomObj.fieldInfo;
      attachInputEvents(box);
      newDomObj.comboBoxWidget.setMaxLength(domObj.maxLength);
    } else {
      pui.assignModifiedEvents(newDomObj);
    }
  }


  // Process change to id
  if (propConfigName == "id" && isDesignMode) {
    var designer = designItem.designer;
    var selection = designer.selection;

    if (designItem.dom.id != newValue && document.getElementById(newValue) != null) {
      if (!(pui["is_old_ie"] && designItem.dom.id.toUpperCase() == newValue.toUpperCase())) { // IE has a bug -- getElementById is case insensitive
        pui.alert('The ID "' + newValue + '" is already in use.');
        designer.propWindow.refresh();
        return dom;
      }
    }

    // Update screen properties object for new items when id changes to prevent
    // double-saving of the item.
    for (var i = 0; i < selection.resizers.length; i++) {
      if (designItem.properties.newitem == "true") {
        if (screenPropertiesObj[designer.currentScreen.screenId] && screenPropertiesObj[designer.currentScreen.screenId].items) {
          var items = screenPropertiesObj[designer.currentScreen.screenId].items;
          for (var j = 0; j < items.length; j++) {
            if (items[j].id == designItem.properties.id) {
              items[j].id = newValue;
            }
          }
        }
      }
    }

    // If the id of a tab panel changes, look for its child members.
    if (properties["field type"] == "tab panel") {
      // Look at each item in the designer.
      for (var i = 0; i < designer.items.length; i++) {
        // If the item's "parent tab panel" matches the old "id", then fix "parent tab panel".
        if (designer.items[i].properties["parent tab panel"] == designItem.dom.id) {
          designer.items[i].properties["parent tab panel"] = newValue;
          designer.items[i].dom.parentTabPanel = newValue;
          designer.items[i].propertiesChanged["parent tab panel"] = true;
          designer.propWindow.refreshProperty("parent tab panel");
        }
      }
    }

    if (selection.resizers.length == 1) {
      designer.propWindow.setHeader("Properties - " + effectiveValue);
    }
  }


  // Process change in Parent Tab Panel or Parent Tab
  if (propConfigName == "parent tab panel" && (isDesignMode || properties["visibility"] != "hidden")) {
    domObj.parentTabPanel = effectiveValue;
  }
  if (propConfigName == "parent tab") {
    domObj.parentTab = effectiveValue;
  }

  // Process change in position.
  if (propConfigName == "top" || propConfigName == "left" || propConfigName == "right" || propConfigName == "bottom") {

    pui.posFix(domObj);

  }

  // Set up empty text
  if (propConfigName == "empty text" && !isDesignMode) {
    pui.setEmptyText(domObj, effectiveValue);
  }


  var js = null;
  if (String(newValue).substr(0, 3).toLowerCase() == "js:") {
    js = newValue.substr(3);
  }
  if (String(newValue).substr(0, 11).toLowerCase() == "javascript:") {
    js = newValue.substr(11);
  }
  if (String(newValue).substr(0, 7).toLowerCase() == "script:") {
    js = newValue.substr(7);
  }

  // Process stylesheet property change
  if (propConfig.stylename != null) {
    if (propConfig.stylename == "visibility" && isDesignMode) {
      if (effectiveValue == "hidden") {
        domObj.style.filter = "alpha(opacity=30)";
        domObj.style.opacity = 0.30;
      } else {
        domObj.style.filter = "";
        domObj.style.opacity = "";
        domObj.style.visibility = effectiveValue;
      }
    } else if (propConfig.stylename == "backgroundColor" && domObj.tabPanel != null) {
      if (effectiveValue) domObj.tabPanel.backColor = effectiveValue;
      else domObj.tabPanel.backColor = "#eeeeff";
      if (context == "genie" || isDesignMode) domObj.tabPanel.draw();
    } else {
      try {
        var posdim = pui.getPosDimString(propConfig.stylename, effectiveValue);
        
        // Prevent German eszett from being changed to "SS" by changing it to captial eszett. 5369.
        if (propConfig.stylename == "textTransform" && effectiveValue == "uppercase"){
          function comboInputFilter(e){
            e.target.value = pui.replaceProblemCaseChars(e.target.value, false);
          }
          
          if ((domObj.tagName == "INPUT" && domObj.type == "text") || domObj.tagName == "TEXTAREA"){
            domObj.value = pui.replaceProblemCaseChars(domObj.value, false);
            domObj.addEventListener("input", comboInputFilter);
          }
          else if(domObj.comboBoxWidget != null){
            var comboInput = domObj.comboBoxWidget.getBox();
            comboInput.value = pui.replaceProblemCaseChars(comboInput.value, false);
            comboInput.addEventListener("input", comboInputFilter);
          }
        }
        
        domObj.style[propConfig.stylename] = posdim;

        // To allow inline-style setting and removing, cache the style property.
        if (isDesignMode) {
          if (effectiveValue === null || effectiveValue.length == 0)
            pui.removeCachedStyle(domObj, propConfig.stylename);
          else
            pui.cacheStyle(domObj, propConfig.stylename, posdim);
        }
      } catch (err) {
        if (js == null && isDesignMode) {
          var msg = "'" + newValue + "' is not a valid value for " + propConfigName + ".";
          if (toolbar.loadingDisplay) {
            var formatName = toolbar.designer.screenProperties[toolbar.designer.currentScreen.screenId]["record format name"];
            if (properties["grid"] != null) {
              var gridDom = getObj(properties["grid"]);
              if (gridDom != null && gridDom.grid != null) {
                formatName = gridDom.grid.recordFormatName;
              }
            }
            msg += "\n\n\nRecord Format: " + formatName;
            msg += "\n\nElement Id: " + properties["id"];
            msg += "\n\nElement Type: " + properties["field type"];
          }
          pui.alert(msg);
        }
      }
      if (domObj.tabPanel != null) {
        if (propConfig.stylename == "color" || propConfig.stylename == "fontFamily" || propConfig.stylename == "fontSize" || propConfig.stylename == "height" || propConfig.stylename == "width") {
          if (context == "genie" || isDesignMode) domObj.tabPanel.draw();
        }
      }
    }
    if (propConfig.stylename == "visibility" && effectiveValue == "hidden" && !isDesignMode && properties["field type"] == "date field") {
      setTimeout(function () {
        if (domObj.calimg && domObj.style.visibility == "hidden") domObj.calimg.style.visibility = "hidden";
      }, 1);
    }
    if (propConfig.stylename == "visibility" && effectiveValue == "hidden" && !isDesignMode && properties["field type"] == "spinner") {
      setTimeout(function () {
        if (domObj.spinner && domObj.style.visibility == "hidden") domObj.spinner.hide();
      }, 1);
    }
    if (propConfig.stylename == "color" && domObj.firstChild != null && domObj.firstChild.tagName == "A") {
      domObj.firstChild.style.color = effectiveValue;
    } else if (propConfig.stylename == "color" && domObj.firstChild != null && domObj.firstChild.nextSibling != null && domObj.firstChild.nextSibling.tagName == "A") { // assuming first child is a text node, and has a sibling that is a hyperlink
      domObj.firstChild.nextSibling.style.color = effectiveValue;
    }

    if (propConfig.stylename == "textDecoration" && domObj.firstChild != null && domObj.firstChild.tagName == "A") {
      domObj.firstChild.style.textDecoration = effectiveValue;
    } else if (propConfig.stylename == "textDecoration" && domObj.firstChild != null && domObj.firstChild.nextSibling != null && domObj.firstChild.nextSibling.tagName == "A") { // assuming first child is a text node, and has a sibling that is a hyperlink
      domObj.firstChild.nextSibling.style.textDecoration = effectiveValue;
    }

    if (propConfig.stylename == "width" && !widget.resizable) domObj.style.width = "";
    if (propConfig.stylename == "height" && !widget.resizable) domObj.style.height = "";
  }

  // Process attribute property change
  if (propConfig.attribute != null) {
    if (effectiveValue == "") {
      try {
        if (propConfig.attribute === "style") {
          removeInlineCSS(domObj);
        } else {
          domObj.removeAttribute(propConfig.attribute);
        }
        if (propConfig.attribute == "class") {
          domObj.className = "";
        }
      } catch (err) {
        if (js == null && isDesignMode) pui.alert(err.message);
      }
    } else {
      try {
        var valueToAssign = effectiveValue;
        if (propConfig.type == "boolean" && valueToAssign == "true") {
          valueToAssign = true;
          if (propConfig.attribute == "disabled" && isDesignMode) valueToAssign = false;
        }
        if (propConfig.type == "boolean" && valueToAssign == "false") valueToAssign = false;
        if (valueToAssign == false) {
          if (domObj.getAttribute(propConfig.attribute) != null) {
            domObj.removeAttribute(propConfig.attribute);
          }
        } else {
          if (propConfig.attribute == "src") valueToAssign = pui.normalizeURL(valueToAssign, true);
          if (propConfig.attribute === "style") {
            addInlineCSS(domObj, valueToAssign, (properties["field type"] === "layout"));
          } else {
            domObj.setAttribute(propConfig.attribute, valueToAssign);
          }
          if (propConfig.attribute == "class") {
            domObj.className = valueToAssign;
          }
        }
      } catch (e) {
        if (js == null && isDesignMode) {
          var msg = "'" + newValue + "' is not a valid value for " + propConfigName + ".";
          if (toolbar.loadingDisplay) {
            var formatName = toolbar.designer.screenProperties[toolbar.designer.currentScreen.screenId]["record format name"];
            if (properties["grid"] != null) {
              var gridDom = getObj(properties["grid"]);
              if (gridDom != null && gridDom.grid != null) {
                formatName = gridDom.grid.recordFormatName;
              }
            }
            msg += "\n\n\nRecord Format: " + formatName;
            msg += "\n\nElement Id: " + properties["id"];
            msg += "\n\nElement Type: " + properties["field type"];
          }
          pui.alert(msg);
        }
      }
    }
  }

  // Process classes
  if (context == "dspf" && (propConfigName.substr(0, 9) == "css class" || propConfigName == "display attribute field")) {
    var classes = [];
    classes.push(properties["css class"]);
    var clsNum = 2;
    var cls = properties["css class " + clsNum];
    while (cls != null) {
      classes.push(cls);
      clsNum++;
      cls = properties["css class " + clsNum];
    }
    var idx = Number(propConfigName.substr(10));
    if (isNaN(idx) || idx < 1 || idx > 99) idx = 1;
    if (propConfigName != "display attribute field") classes[idx - 1] = effectiveValue;
    var attr = properties["display attribute field"];
    var dspAtrField = false;
    if (attr != null && !pui.isBound(attr) && attr != "" && attr != " ") {
      classes = classes.concat(pui.attrToCSS(attr));
      dspAtrField = true;
    }
    assignDomClasses(domObj, classes, dspAtrField);
  }
  // Attach Events
  if (propConfig.type == "js") {
    var func = null;
    if (propConfigName == "ontabclick") {
      func = function () {
        eval("var tab = arguments[0];");
        try {
          return eval(newValue);
        } catch (err) {
          pui.scriptError(err, propConfigName.substr(0, 1).toUpperCase() + propConfigName.substr(1) + " Error:\n");
        }
      };
    } else if (propConfigName == "onoptionclick") {
      func = function () {
        eval("var value = arguments[0];");
        eval("var text = arguments[1];");
        try {
          eval(newValue);
        } catch (err) {
          pui.scriptError(err, propConfigName.substr(0, 1).toUpperCase() + propConfigName.substr(1) + " Error:\n");
        }
      };
    } else if (propConfigName == "onspin") {
      func = function () {
        var code = newValue;
        eval("var value = arguments[0];");
        eval("var increment = arguments[1];");
        eval("var spinner = arguments[2];");
        eval("var newValue = arguments[3];");
        eval("var row;");
        if (subfileRow != null) {
          eval("row = " + subfileRow + ";");
        }
        eval("var rrn;");
        if (subfileRow != null) {
          eval("rrn = " + subfileRow + ";");
        }
        eval("var rowNumber;");
        if (domObj.dataArrayIndex != null) {
            eval("rowNumber = " + (domObj.dataArrayIndex+1) + ";");
        }
        try {
          return eval(code);
        } catch (err) {
          pui.scriptError(err, propConfigName.substr(0, 1).toUpperCase() + propConfigName.substr(1) + " Error:\n");
        }
      };
    } else if (propConfigName == "onchartclick") {
      func = function () {
        eval("var name = arguments[0];");
        if (typeof name == "object") {
          eval("var category = name.category");
          eval("var name = name.name");
        }
        try {
          var customFunction = eval(newValue);
          if (typeof customFunction == "function") {
            customFunction(arguments[0]);
          }
        } catch (err) {
          pui.scriptError(err, propConfigName.substr(0, 1).toUpperCase() + propConfigName.substr(1) + " Error:\n");
        }
      };
    }
    else if (propConfigName == "onoptiondisplay") {
      func = function () {
        eval("var row;");
        if (subfileRow != null) {
          eval("row = " + subfileRow + ";");
        }
        eval("var rrn;");
        if (subfileRow != null) {
          eval("rrn = " + subfileRow + ";");
        }
        eval("var rowNumber;");
        if (domObj.dataArrayIndex != null) {
            eval("rowNumber = " + (domObj.dataArrayIndex+1) + ";");
        }
        eval("var choices;");
        if (domObj.comboBoxWidget != null && domObj.comboBoxWidget["choices"] != null) {
            pui["temp_value"] = domObj.comboBoxWidget["choices"]; 
            eval("choices = pui.temp_value.slice(0);");
        }
        eval("var values;");
        if (domObj.comboBoxWidget != null && domObj.comboBoxWidget["choice values"] != null) {
            pui["temp_value"] = domObj.comboBoxWidget["choices"]; 
            eval("values = pui.temp_value.slice(0);");
        }
        try {
          var customFunction = eval(newValue);
          if (typeof customFunction == "function") {
            customFunction();
          }
        } catch (err) {
          pui.scriptError(err, propConfigName.substr(0, 1).toUpperCase() + propConfigName.substr(1) + " Error:\n");
        }
        if (domObj.comboBoxWidget != null && domObj.comboBoxWidget["choices"] != null) {
          eval("pui.temp_value = choices;");
          domObj.comboBoxWidget["choices"] = pui["temp_value"].slice(0);
        }
        if (domObj.comboBoxWidget != null && domObj.comboBoxWidget["choice values"] != null) {
          eval("pui.temp_value = values;");
          domObj.comboBoxWidget["choice values"] = pui["temp_value"].slice(0);
        }
      };
    }
    else if (propConfigName != "onselect" && propConfigName != "ondragstart") { 
      // Handling for "onselect" one is provided inside the auto complete class.
      // Handling for "ondragstart" is in dragDrop.js
      func = function(e) {
        if (pui.observer != null) return;
        if ((domObj.getAttribute != null && domObj.getAttribute("disabled") == "true") ||
          (domObj.disabled != null && domObj.disabled == true)) {
          return;
        }
        eval("var row;");
        if (subfileRow != null) {
          eval("row = " + subfileRow + ";");
        }
        eval("var rrn;");
        if (subfileRow != null) {
          eval("rrn = " + subfileRow + ";");
        }
        eval("var rowNumber;");
        if (domObj.dataArrayIndex != null) {
            eval("rowNumber = " + (domObj.dataArrayIndex+1) + ";");
        }
        pui["temp_event"] = e;
        eval("var event = pui.temp_event;");
        try {
          if (pui["is_ios"]) {  
            delete pui.iscrolltapped;  //Allow next CSS button tap to fire onclick. #5169.
          }
          
          var customFunction = eval(newValue);
          if (typeof customFunction == "function") {
            if (!e) e = window.event;
            customFunction(e, this);
          }
        } catch (err) {
          pui.scriptError(err, propConfigName.substr(0, 1).toUpperCase() + propConfigName.substr(1) + " Error:\n");
        }
      };
    }
    if (!isDesignMode && func != null) {
      domObj[propConfigName] = func;
      if (domObj.comboBoxWidget != null) {
        if (propConfigName != "onselect" && propConfigName != "onoptiondisplay") domObj.comboBoxWidget.assignJSEvent(propConfigName, func);
      }
    }
  }

  // Reflect changes to designer
  if (isDesignMode) {
    if (newValue != "" || properties[propConfigName] != null)
      properties[propConfigName] = newValue;
    designItem.propertiesChanged[propConfigName] = true;
    if (propConfigName == "field type" ||
      propConfigName == "left" ||
      propConfigName == "top" ||
      propConfigName == "z index" ||
      propConfigName == "visibility" ||
      propConfigName == "height" ||
      propConfigName == "width" ||
      propConfigName == "label" ||
      propConfigName == "color" ||
      propConfigName == "font family" ||
      propConfigName == "font size" ||
      propConfigName == "font style" ||
      propConfigName == "font weight") {
      designItem.drawIcon();
    }
    designItem.mirrorDown();
    if (resizer != null) resizer.positionSizies();
    if (context == "dspf") {
      if (propConfigName == "id") {
        pui.ide.refreshFieldList();
      }
      if (propConfigName == "id" || propConfigName == "field type" || propConfigName == "value") {
        pui.ide.refreshElementList();
      }
      if (!designItem.isProxy){
        designItem.designer.makeDirty();
        pui.ide.refreshRibbon();  //Enable Save on toolbar
      }
    }
  }

  // Execute widget's property after setter methods
  globalSetter = widget.globalAfterSetter;
  setters = widget.afterSetters;
  setter = null;
  if (setters != null) {
    setter = setters[propConfigName];
  }
  var setterParms;
  if (setter != null || globalSetter != null) {
    setterParms = {
      newValue: newValue,
      value: effectiveValue,
      design: isDesignMode,
      properties: properties,
      originalValue: originalValue,
      dom: dom,
      oldDom: domObj,
      propertyName: propConfigName,
      designItem: designItem,
      resizer: resizer,
      evalProperty: function (propName) {
        return evalPropertyValue(this.properties[propName], this.originalValue, this.dom);
      }
    };
  }
  if (globalSetter != null) {
    globalSetter(setterParms);
  }
  if (setter != null) {
    setter(setterParms);
  }

  return dom;

}

function assignDomClasses(dom, classes, lastClassIsDspAtrField) {
  var classArray = [];
  var RI = false;
  var toCombineWithRI = [];
  var foundColor = false;
  var colorIdx = null;

  function isColor(cssClass) {
    return (cssClass == "BLU" || cssClass == "GRN" || cssClass == "PNK" || cssClass == "RED" || cssClass == "TRQ" || cssClass == "WHT" || cssClass == "YLW");
  }
  for (var i = 0; i < classes.length; i++) {
    var dspAtrField = false;
    if (lastClassIsDspAtrField && i == classes.length - 1) dspAtrField = true;
    var cssClass = classes[i];
    if (cssClass == null || cssClass == "") continue;
    if (isColor(cssClass)) {
      if (foundColor && !dspAtrField) continue; // only 1 color is applied at runtime / "display attribute field" is an exception
      if (!foundColor) {
        foundColor = true;
        colorIdx = classArray.length;
      } else if (dspAtrField && colorIdx != null) {
        classArray[colorIdx] = cssClass;
        continue;
      }
    }
    classArray.push(cssClass);
    //if (classString != "") classString += " ";
    //classString += cssClass;
    if (cssClass == "PR" || cssClass == "PR-UL") {
      dom.readOnly = true;
      dom.tabIndex = "-1";
      if (dom.tagName == "SELECT") {
        dom.disabled = true;
      }
      if (dom.comboBoxWidget != null) {
        var boxDom = dom.comboBoxWidget.getBox();
        boxDom.readOnly = true;
        boxDom.disabled = true;
        boxDom.tabIndex = "-1";
      }
    }
    if (cssClass == "RI") RI = true;
    if (isColor(cssClass) || cssClass == "HI") {
      toCombineWithRI.push(cssClass);
    }
  }
  if (RI) {
    for (var i = 0; i < toCombineWithRI.length; i++) {
      //classString += " RI-" + toCombineWithRI[i];
      classArray.push("RI-" + toCombineWithRI[i]);
    }
  }
  var classString = classArray.join(" ");
  dom.setAttribute("class", classString);
  dom.className = classString;
}

// Evaluate property if javascript used
function evalPropertyValue(propertyValue) {

  var effectiveValue = "";

  if (pui.isBound(propertyValue) || pui.isTranslated(propertyValue)) {
    if (propertyValue.designValue != null) effectiveValue = propertyValue.designValue;
    return effectiveValue;
  }

  // Calculate Effective Value
  if (propertyValue == null) propertyValue = "";
  var js = null;
  if (String(propertyValue).substr(0, 3).toLowerCase() == "js:") {
    js = propertyValue.substr(3);
  }
  if (String(propertyValue).substr(0, 11).toLowerCase() == "javascript:") {
    js = propertyValue.substr(11);
  }
  if (String(propertyValue).substr(0, 7).toLowerCase() == "script:") {
    js = propertyValue.substr(7);
  }
  if (js == null || trim(js) == "") {
    effectiveValue = propertyValue;
  } else {
    eval("var value = arguments[1];");
    eval("var obj = arguments[2];");
    try {
      effectiveValue = eval(js);
    } catch (err) {
      if (!pui.suppressPropertyScriptingErrors) {
        pui.suppressPropertyScriptingErrors = true;
        setTimeout(function () {
          pui.alert("Expression '" + trim(js) + "' contains an error:\n\n" + err.message);
          pui.suppressPropertyScriptingErrors = false;
        }, 1);
      }
    }
  }
  return effectiveValue;
}



function getScreenProperties(designScreen, onsuccess, onfail) {
  var skin = pui.skin;
  var skinsFolder = "genie skins";
  var query = "?type=genie_screen&skin=" + encodeURIComponent(skin) + "&screen=" + encodeURIComponent(designScreen.name) + "&mod=";
  var stamp;
  if (typeof (designScreen.modified) != "undefined") stamp = designScreen.modified;
  else stamp = getTimeStamp();
  query += stamp;
  if (cachedScreens[designScreen.name + "." + stamp] != null) {
    screenPropertiesObj[designScreen.screenId] = cachedScreens[designScreen.name + "." + stamp];
    onsuccess();
    return;
  }
  var request = new pui.Ajax(getProgramURL("PUI0009115.pgm" + query));
  request["async"] = true;
  request["method"] = "get";
  request["suppressAlert"] = true;
  request["onsuccess"] = function () {
    var text = "(" + request.getResponseText() + ")";
    var obj = eval(text);
    if (obj["items"] != null && obj["items"].length > 0) {
      // Support skin customizations using "csv file name", which was replaced by "export file name".
      for (var i = 0; i < obj["items"].length; i++) {
        if (obj["items"][i]["csv_file_name"] != null && obj["items"][i]["export_file_name"] == null)
          obj["items"][i]["export_file_name"] = obj["items"][i]["csv_file_name"];
      }
    }
    screenPropertiesObj[designScreen.screenId] = obj;
    cachedScreens[designScreen.name + "." + stamp] = obj;
    onsuccess();
  };
  request["onfail"] = function () {
    pui.alert("An error occurred while loading screen '" + designScreen.name + "'.\n\nHTTP " + request.getStatus() + "\n\n" + request.getStatusText() + ".");
    onfail();
  };
  request.send();
}




pui.addCustomProperty = function (parms) {
  var pm = getPropertiesModel();
  var pnm = getPropertiesNamedModel();
  var found = false;
  var insertAt = pm.length;

  // search for category
  for (var i = 0; i < pm.length; i++) {
    if (pm[i].category == true && pm[i].name == parms.category) {
      insertAt = i + 1;
      found = true;
      break;
    }
  }

  // add category if not found
  if (!found) {
    // add category
    pm.splice(insertAt, 0, {
      name: parms.category,
      category: true,
      controls: parms.controls
    });
    insertAt++;
  }

  // insert property into both the properties model (array for reading properties sequentially) and the properties named model (object for referencing properties by name)
  delete parms.category; // the category name doesn't belong on the property definition in the properties model
  pm.splice(insertAt, 0, parms);
  pnm[parms.name] = parms;

};


// Styles that should be ignored if the user puts any into "inline css";
// widget properties should set these.
pui.restrictedStylenames = [
  "position", "visibility", "display", "left", "right", "top", "bottom", "width", "height"
];

// Styles that should be ignored if the user puts any into "inline css" for
// Layout widgets.
pui.restrictedLayoutStylenames = ["overflow", "overflow-x", "overflow-y"];


/**
 * Add the user's inline style to a widget if the style isn't in managedStylenames.
 * Put the style in a list of user defined inline styles.
 * Previous values from "inline style" are removed from the style object first.
 *
 * @param {Object} domObj
 * @param {String} valueToAssign
 * @param {Boolean} isLayout     True when the widget is a Layout. Overflow is ignored on Layouts.
 * @returns {undefined}
 */
function addInlineCSS(domObj, valueToAssign, isLayout) {
  // Quickly clear any old inline styles.
  if (domObj.pui.styleInline && domObj.pui.styleInline !== null) {
    // For each style explicitly set earlier, remove it from dom.style.
    for (var keyname in domObj.pui.styleInline) {
      domObj.style[keyname] = "";
    }
  }
  domObj.pui.styleInline = {};

  var vals = valueToAssign.split(";");
  // Foreach style, add the keyname to a list.
  for (var i = 0; i < vals.length; i++) {
    var parts = vals[i].split(":");
    if (parts.length != 2) continue;

    var key = parts[0].replace(/^\s+|\s+$/gm, ""); // IE8 compatible trim whitespace.
    key = key.toLowerCase();

    // Ignore restricted styles.
    if (pui.arrayIndexOf(pui.restrictedStylenames, key) >= 0) continue;

    if (isLayout && pui.arrayIndexOf(pui.restrictedLayoutStylenames, key) >= 0) continue;

    domObj.pui.styleInline[key] = parts[1];
    domObj.style[key] = parts[1];
  }

  // Re-assert the cached values to override overlapping inline styles.
  // Styles overlap when the inline style has something general like "border:",
  // "overflow:", "font:", "background:", or "padding:".
  if (domObj.pui.styleCached && domObj.pui.styleCached !== null) {
    for (var keyname in domObj.pui.styleCached) {
      domObj.style[keyname] = domObj.pui.styleCached[keyname];
    }
  } else {
    domObj.pui.styleCached = {};
  }
}

/**
 * Remove all user-defined styles from the object that were set in "inline style".
 * The cached style is restored.
 *
 * This should be called when "inline style" is cleared.
 *
 * @param {Object} domObj
 * @returns {undefined}
 */
function removeInlineCSS(domObj) {
  if (typeof (domObj.pui.styleInline) !== "object" || domObj.pui.styleInline === null)
    return;

  // For each style name explicitly set earlier, remove it from dom.style.
  for (var keyname in domObj.pui.styleInline) {
    domObj.style[keyname] = "";
  }
  domObj.pui.styleInline = null;

  // Restore original styles.
  if (domObj.pui.styleCached && domObj.pui.styleCached !== null) {
    for (var keyname in domObj.pui.styleCached) {
      domObj.style[keyname] = domObj.pui.styleCached[keyname];
    }
  } else {
    domObj.pui.styleCached = {};
  }
}

/**
 * Store the PUI style property. This allows us to restore and/or remove
 * inline css or a style property when either's values overlap and one changes.
 *
 * This should be called when a property with .stylename is being set.
 * This may also be called from Layout.js when min-height and other properties
 * are set.
 *
 * @param {Object} domObj
 * @param {String} stylename  The CSS style keyword (not the PUI style property name).
 * @param {String} effectiveValue
 * @returns {undefined}
 */
pui.cacheStyle = function (domObj, stylename, effectiveValue) {
  if (!domObj.pui.styleCached || domObj.pui.styleCached === null) {
    domObj.pui.styleCached = {};
  }

  // Cache the style if it isn't restricted. (Ignore restricted values to avoid
  // repositioning when we re-assert cached values.)
  if (pui.arrayIndexOf(pui.restrictedStylenames, stylename) < 0)
    domObj.pui.styleCached[stylename] = effectiveValue;
};

/**
 * Remove the cached style property and reset the style to reflect the new
 * state of the domObj.
 *
 * This should be called when a .stylename property is cleared.
 * This may also be called from Layout.js when min-height and other properties
 * are set.
 *
 * @param {Object} domObj
 * @param {String} stylename  The CSS style keyword (not the PUI style property name).
 * @returns {undefined}
 */
pui.removeCachedStyle = function (domObj, stylename) {

  if (typeof domObj.pui.styleCached != "undefined" &&
    domObj.pui.styleCached[stylename] != "undefined") {
    delete domObj.pui.styleCached[stylename];
  }

  // Re-assert all of the inline style values.
  if (typeof (domObj.pui.styleInline) === "object" || domObj.pui.styleInline !== null) {
    for (var keyname in domObj.pui.styleInline) {
      domObj.style[keyname] = domObj.pui.styleInline[keyname];
    }
  }

  // Re-assert the styleCached values to override overlapping inline styles.
  for (var keyname in domObj.pui.styleCached) {
    domObj.style[keyname] = domObj.pui.styleCached[keyname];
  }
};

pui["getPropertiesModel"] = getPropertiesModel;
pui["getPropertiesNamedModel"] = getPropertiesNamedModel;