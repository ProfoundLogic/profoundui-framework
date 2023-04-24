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
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//  GNU Lesser General Public License for more details.
//
//  You should have received a copy of the GNU Lesser General Public License
//  In the COPYING and COPYING.LESSER files included with the Profound UI Runtime.
//  If not, see <http://www.gnu.org/licenses/>.

/**
 * GridTreeNode Class.
 * @constructor
 */
pui.GridTreeNode = function (data) {
  this.data = data;
  this.showNode = true; // show or hide this node in model tree
  this.currentState = "expanded"; // current state of this node:
  //   "expanded"  ==> children nodes are shown
  //   "collapsed" ==> children nodes are hidden
  this.children = [];
  this.parentNode = null;
  // Show row in grid view only if NONE of its ancestor is hidden. This is needed so we can "remember" the PREVIOUS
  // show/hide status of a child row of a row that's being expanded or collapsed.
  // We expand a node one level only; i.e. show only its immediate children.
  // But, the children of those children will be shown or hidden based on their previous state.
  this.showRow = true;
};

/**
 * GridTree Class.
 * @constructor
 */
pui.GridTree = function () {
  this.root = null;
};

pui.GridTree.prototype.add = function (data, toNodeData) {
  var node = new pui.GridTreeNode(data);
  var parent = toNodeData ? this.findBFS(toNodeData) : null;
  if (parent) {
    parent.children.push(node);
    node.parentNode = parent;
  }
  else {
    if (!this.root) {
      this.root = node;
    }
    else {
      return "Root node is already assigned";
    }
  }
  return node;
};

pui.GridTree.prototype.hideChildren = function (node) {
  node.currentState = "collapsed";
  for (var i = 0; i < node.children.length; i++) {
    node.children[i].showNode = false;
  }
  this.refreshShowRow(node);
};

pui.GridTree.prototype.showChildren = function (node) {
  node.currentState = "expanded";
  for (var i = 0; i < node.children.length; i++) {
    node.children[i].showNode = true;
  }
  this.refreshShowRow(node);
};

pui.GridTree.prototype.toggleChildren = function (node) {
  if (node.currentState === "expanded") {
    this.hideChildren(node);
    node.currentState = "collapsed";
  }
  else {
    this.showChildren(node);
    node.currentState = "expanded";
  }
};

pui.GridTree.prototype.isAncestorHidden = function (node) {
  var parentNode = node.parentNode;
  if (parentNode === null) {
    return false;
  } // reached root node
  if (parentNode.showNode === false) {
    return true;
  } // return "true"  if any ancestor is hidden
  else {
    return this.isAncestorHidden(parentNode);
  } // recursively back up the tree
};

pui.GridTree.prototype.remove = function (data) {
  if (this.root.data === data) {
    this.root = null;
  }

  var queue = [this.root];
  while (queue.length) {
    var node = queue.shift();
    for (var i = 0; i < node.children.length; i++) {
      if (node.children[i].data === data) {
        node.children.splice(i, 1);
      }
      else {
        queue.push(node.children[i]);
      }
    }
  }
};

pui.GridTree.prototype.contains = function (data) {
  return this.findBFS(data) ? true : false;
};

pui.GridTree.prototype.findBFS = function (data) {
  var queue = [this.root];
  while (queue.length) {
    var node = queue.shift();
    if (node.data === data) {
      return node;
    }
    for (var i = 0; i < node.children.length; i++) {
      queue.push(node.children[i]);
    }
  }
  return null;
};

pui.GridTree.prototype._preOrder = function (node, fn) {
  if (node) {
    if (fn) {
      fn(node);
    }
    for (var i = 0; i < node.children.length; i++) {
      this._preOrder(node.children[i], fn);
    }
  }
};

pui.GridTree.prototype._postOrder = function (node, fn) {
  if (node) {
    for (var i = 0; i < node.children.length; i++) {
      this._postOrder(node.children[i], fn);
    }
    if (fn) {
      fn(node);
    }
  }
};

pui.GridTree.prototype.collapseAll = function () {
  function collapseAllFn (node) {
    node.showNode = false;
    node.showRow = false;
    node.currentState = "collapsed";
  }
  this.traverseDFS(collapseAllFn);
  // always "show" root node in the model, even though it does not show in the view
  this.root.showNode = true;
  // show level-1 nodes in collapsed mode, since we do NOT show the root node (level=0) in the view
  var levelOneNodes = this.root.children;
  for (var i = 0; i < levelOneNodes.length; i++) {
    var levelOneNode = levelOneNodes[i];
    levelOneNode.showNode = true;
    levelOneNode.showRow = true;
    levelOneNode.currentState = "collapsed";
  }
};

pui.GridTree.prototype.expandAll = function () {
  // Set the variable of the primary level tree
  function expandAllFn (node) {
    // Set to show the node
    node.showNode = true;
    // Set to show the row (children)
    node.showRow = true;
    node.currentState = "expanded";
  }
  // Closure for the _postOrder
  this.traverseDFS(expandAllFn);
  // always "show" root node in the model, even though it does not show in the view
  this.root.showNode = true;
  // show level-1 nodes in expanded mode
  var levelOneNodes = this.root.children;
  for (var i = 0; i < levelOneNodes.length; i++) {
    var levelOneNode = levelOneNodes[i];
    levelOneNode.showNode = true;
    levelOneNode.showRow = true;
    levelOneNode.currentState = "expanded";
  }
};

pui.GridTree.prototype.refreshShowRow = function (node) {
  node.showRow = true;
  if (node.showNode === false || this.isAncestorHidden(node)) {
    node.showRow = false;
  }
  for (var i = 0; i < node.children.length; i++) {
    this.refreshShowRow(node.children[i]);
  }
};

pui.GridTree.prototype.traverseDFS = function (fn, method) {
  var current = this.root;
  if (method) {
    this["_" + method](current, fn);
  }
  else {
    this._preOrder(current, fn);
  }
};

pui.GridTree.prototype.traverseBFS = function (fn) {
  var queue = [this.root];
  while (queue.length) {
    var node = queue.shift();
    if (fn) {
      fn(node);
    }
    for (var i = 0; i < node.children.length; i++) {
      queue.push(node.children[i]);
    }
  }
};

pui.GridTree.prototype.print = function () {
  if (!this.root) {
    return console.log("No root node found");
  }
  var newline = new pui.GridTreeNode("|");
  var queue = [this.root, newline];
  var string = "";
  while (queue.length) {
    var node = queue.shift();
    string += node.data.toString() + " ";
    if (node === newline && queue.length) {
      queue.push(newline);
    }
    for (var i = 0; i < node.children.length; i++) {
      queue.push(node.children[i]);
    }
  }
  console.log(string.slice(0, -2).trim());
};

pui.GridTree.prototype.printByLevel = function () {
  if (!this.root) {
    return console.log("No root node found");
  }
  var newline = new pui.GridTreeNode("\n");
  var queue = [this.root, newline];
  var string = "";
  while (queue.length) {
    var node = queue.shift();
    string += node.data.toString() + (node.data !== "\n" ? " " : "");
    string += printData + (printData !== "\n" ? " " : "");
    if (node === newline && queue.length) {
      queue.push(newline);
    }
    for (var i = 0; i < node.children.length; i++) {
      queue.push(node.children[i]);
    }
  }
  console.log(string.trim());
};

pui.GridTree.prototype.load = function (treeLevelData) {
  var tree = this;
  // root node:
  // level = 0
  // rrn   = 0
  var rrn = "0";
  var treelLevel = 0;
  tree.add("0");
  var parentRRNsave = {};
  parentRRNsave[treelLevel] = rrn;
  for (var i = 0; i < treeLevelData.length; i++) {
    var data = treeLevelData[i];
    var treeLevel = data.treeLevel;
    var treeLevelMinusOne = treeLevel - 1;
    var rrn = (i + 1).toString();
    var parentRRN = parentRRNsave[treeLevelMinusOne];
    var node = tree.add(rrn, parentRRN);
    data.node = node;
    parentRRNsave[treeLevel] = rrn;
  }
};

pui.GridTree.prototype.getMaxRRN = function (node) {
  var rrnMax = parseInt(node.data);
  _getMaxRRN(node);
  return rrnMax;

  function _getMaxRRN (node) {
    var rrn = parseInt(node.data);
    if (rrn > rrnMax) {
      rrnMax = rrn;
    }
    for (var i = 0; i < node.children.length; i++) {
      _getMaxRRN(node.children[i]);
    }
  }
};
