# Profound UI Framework

This is the README file for the open source ProfoundUI runtime.


## Table of Contents
1. [Introduction](#introduction)
2. [License Information](#license-information)
3. [How To Build](#how-to-build)
4. [Integration with Fusion Charts](#integration-with-fusion-charts)
3. [How To Use](#how-to-use)
3. [Contact Profound Logic](#contact-profound-logics)


## INTRODUCTION
------------
ProfoundUI is a commercial product including a screen designer, open access handler, and it all runs on top of an open source JavaScript framework that we call "runtime."  We believe that it's desirable to be able to use our JavaScript framework directly without a need to purchase our commercial product.  And so, we have released it as this open source framework that we call "ProfoundUI runtime"

The framework works by building "screens" as JSON files, linking the runtime.js into your HTML file, and then calling up the screens via JavaScript calls.  You can learn more about how to use the framework in the ["How to Use"](#how-to-use) section, below.

## LICENSE INFORMATION
-------------------
This open source framework is licensed under the GNU Lesser General Public License.  For details, please see the COPYING file and the COPYING.LESSER file included in this package.  
    
We have chosen this license because we want you to be able to include our runtime with commercial software without the restrictions that would be included if we used the GPL.  However, we would appreciate it if any modifications you make to our framework are contributed back to us.  To contribute a modification, please e-mail the updated framework to support@profoundlogic.com.

## HOW TO BUILD
------------
Note: You do not need to build this project if you have not changed the source code.  We have included a pre-built file named runtime.js for your convenience.

This package contains many JavaScript files (the "source code") located in the proddata/js directory.  We use the Google Closure project to "obfuscate" this source code into a single JavaScript file called runtime.js.  Closure works by making the variable and function names smaller, and combining multiple files into a single file.  This greatly reduces the overall size of the JavaScript, so that it takes up less memory.  That means it'll download faster into the browser, and improve performance.

To build it, download Closure and put it into the /closure directory of your IFS.  Then, run the included QShell script named obfuscate.sh.  This will use Closure to build the runtime.js file.

## INTEGRATION WITH FUSION CHARTS
------------------------------
To use the charting feature of this product, you must integrate it with Fusion Charts from http://www.fusioncharts.com.  Fusion Charts is not a product of Profound Logic, and there may be an additional license fee to use it. Please see Fusion Chart's web site for more information.

To integrate Fusion Charts with this project, create a folder named "charts" under proddata:
````bash
$ cd proddata; mkdir charts
````
Then, copy the .swf and .js files from Fusion Charts into the new "charts" subdirectory.  The Profound UI runtime will see that the chart objects exist, and use them automatically.



## HOW TO USE
----------
We have included a series of sample programs in the "examples" subdirectory to illustrate how to use this project.  Please see the README file in that directory for more information.

## CONTACT PROFOUND LOGIC
----------------------
To contact us:
http://www.profoundlogic.com/contact.rpgsp

