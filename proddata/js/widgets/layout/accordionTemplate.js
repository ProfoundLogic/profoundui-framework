//  Profound UI Runtime  -- A Javascript Framework for Rich Displays
//  Copyright (c) 2018 Profound Logic Software, Inc.
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
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//  GNU Lesser General Public License for more details.
//
//  You should have received a copy of the GNU Lesser General Public License
//  In the COPYING and COPYING.LESSER files included with the Profound UI Runtime.
//  If not, see <http://www.gnu.org/licenses/>.

function helpTextAccordionProperties(defVal, descVal, descAdd, noteVal) {
  var codeOpen = "<code style='color: blue; letter-spacing: 0px; font-weight: bold;'>";
  var codeClose = "</code>";

  var falseSpan = "<span title='The default value of the property is false.'>false</span>";
  var trueSpan = "<span title='The default value of the property is false.'>true</span>";

  var blankSpan = "<span title='The default value of the property is unset or not defined.'>[blank]</span>";

  var cssSpan = "[<span title='The default value is the value defined in the CSS &#010;(theme/developer CSS classes defined in a CSS&#010;file or \"style\" DOM attribute) for the element.'>CSS value</span>]";

  var placeholderSpan = "[<span title='The default value of the property is placeholder &#010;text, such as \"Lorem Ipsum...\" or \"HTML Content\".'>placeholder text</span>]";

  var browserSpan = "[<span title='The default is determined by the browser for the element.'>browser setting</span>]";

  var widgetSpan = "[<span title='The default value of this property is determined by the selected widget.'>selected widget</span>]";

  var themeSpan = "[<span title='The default value of this property is based on the selected widget and its theme/template/purpose.'>selected widget</span>]";

  var skinSpan = "[<span title='The default value of this property is determined by &#010;the selected skin and it's defaults, CSS, and/or JavaScript customizations.'>selected skin</span>]";

  var idSpan = "[<span title='The default ID is based on the name of the selected &#010;widget with no spaces and the first letter of each word capitalized.'>WidgetName</span>][<span title='A whole number value starting from 1 determined by how many of the same widget have previously been added to the Design grid.'>number</span>]";

  var positionSpan = "[<span title='The default values are determined by where the &#010;widget is dropped/placed on the Designer grid.'>user drop point</span>]";

  var bindSpan = "<span title='This property requires being bound and a value passed by an RPG program.'>[bound value]</span>";

  var otherText = " The 'Other...' option can be selected to write in a custom value.";
  var pixelText = "Specify in pixels. <br><br>Example: " + codeOpen + "12px" + codeClose;

  var listStyleTag = "<style>ul.listing {display: block; list-style-type: disc; padding-left: 10px; margin-left: 15px;}</style>";
  var optionsOpen = "<hr><span style='font-weight:bold;'>Valid options</span>: <br><ul class='listing'><li>";
  // var optionsClose = "</li></ul>";
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
    "<br>}<br><br>&#x1F6D1 Make sure your font file extension is supported in the browsers users will be using before attempting this." + codeClose + "<hr>";

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
  var posDefVals = ["css", "blank", "false", "true", "placeholder", "browser", "theme", "skin", "id", "bind", "widget", "position"];
  helpString += codeOpen;
  if (posDefVals.includes(defVal)) {
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
    }
  } else {
    helpString += defVal;
  }
  helpString += codeClose;
  // ------------------
  // Description:
  helpString += "<hr><b title='A general description of the widget's properties.'>Description: </b>";
  // Description text...
  helpString += descVal;

  // Other...
  if (descAdd.includes("other")) {
    helpString += otherText;
  }
  // Color Examples:
  if (descAdd.includes("color")) {
    helpString += colorOptions;
  }
  // Background Color Examples:
  if (descAdd.includes("background color")) {
    helpString += bgColorOptions;
  }
  // Font Family Examples:
  if (descAdd.includes("font")) {
    helpString += fontOptions;
  }
  // Font Family Examples:
  if (descAdd.includes("overflow")) {
    helpString += overflowOptions;
  }
  // Font Family Examples:
  if (descAdd.includes("pixel")) {
    helpString += pixelText;
  }
  // Note: Text...
  if (descAdd.includes("note")) {
    helpString += "<br><br><b style='color: red;'>Note: </b>" + noteVal;
  }
  // ------------------
  helpString += "<hr><br>";

  return helpString;
}

pui.layout.template.accordionTemplate = function (parms) {

  var properties = parms.properties;
  var designMode = parms.designMode;
  var proxyMode = parms.proxyMode;
  var returnProps = parms.returnProps;
  var existingDom = parms.dom;

  if (returnProps) {
    return pui.layout.mergeProps([{
        name: "section names",
        type: "list",
        help: "Specifies a comma separate list of section names for the accordion.",
        translate: true
      },
      {
        name: "active section",
        format: "number",
        help: "This property specifies the initial active section on an Accordion Layout. Each section within an Accordion is identified by a sequential index, starting with 0 for the first section, 1 for the second section, and so on.  The default value is 0."
      },
      {
        name: "header theme",
        choices: ["A - Black", "B - Blue", "C - Gray", "D - Light Gray", "E - Yellow", "F - Green", "G - Red", "Other..."],
        help: "Specifies the jQuery Mobile theme to use for the accordion headers.  The theme is associated with a set of cascading style sheet rules."
      },
      {
        name: "body theme",
        choices: ["A - Black", "B - Blue", "C - Gray", "D - Light Gray", "E - Yellow", "F - Green", "G - Red", "Other..."],
        help: "Specifies the jQuery Mobile theme to use for the content body of the accordion.  The theme is associated with a set of cascading style sheet rules."
      },
      {
        name: "small sections",
        choices: ["true", "false"],
        help: "This property uses CSS to provide a smaller, more compact version of the header sections."
      },
      {
        name: "allow collapse",
        choices: ["true", "false"],
        help: "Determines if the accordion can be fully collapsed."
      },
      {
        name: "straight edge",
        choices: ["all", "left", "right", "top", "bottom"],
        help: "Determines which parts of the element will have a straight edge instead of rounded corners."
      },
      pui.layout.adoptNamedProperty("color"),
      pui.layout.adoptNamedProperty("font family"),
      pui.layout.adoptNamedProperty("font size"),
      pui.layout.adoptNamedProperty("font style"),
      pui.layout.adoptNamedProperty("font weight"),
      pui.layout.adoptNamedProperty("text align"),
      pui.layout.adoptNamedProperty("text decoration"),
      pui.layout.adoptNamedProperty("text transform"),
      {
        name: "onsectionclick",
        type: "js",
        help: "Initiates a client-side script when an accordion section is expanded.  The section index is passed to the event as a parameter named \"section\".  If the client-side script evaluates to false, the section will not be expanded."
      }
    ]);
  }

  var dom;
  if (existingDom != null) {
    dom = existingDom.cloneNode(false);
  } else {
    dom = document.createElement("div");
  }
  dom.innerHTML = "";
  var accordion = new pui.Accordion();
  if (proxyMode) accordion.forProxy = true;
  accordion.container = dom;
  accordion.designMode = designMode;
  accordion.init();
  dom.accordion = accordion;
  dom.sizeMe = function () {
    dom.accordion.resize();
  };

  var sectionNames = properties["section names"];
  accordion.setSectionNames(sectionNames);
  var headerTheme = properties["header theme"];
  if (headerTheme != null) accordion.setHeaderSwatch(headerTheme);
  var bodyTheme = properties["body theme"];
  if (bodyTheme != null) accordion.setBodySwatch(bodyTheme);
  accordion.setStraightEdge(properties["straight edge"]);
  var mini = properties["small sections"];
  mini = (mini === "true" || mini === true);
  accordion.setMini(mini);
  accordion.setAllStyles(properties);
  var height = properties["height"];
  if (height == null) height = "300px";
  accordion.setHeight(height);
  if (!designMode) {
    var activeSection = properties["active section"];
    if (activeSection != null) {
      activeSection = Number(activeSection);
      if (!isNaN(activeSection) && activeSection != 0) {
        accordion.expandSection(activeSection);
      }
    }
  }

  if (proxyMode) {
    dom.style.position = "relative";
  }

  return dom;

};