function Node (x, y, width, height) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.children = [];
  return this;
}

Node.prototype.in = function (node) {
  let { x = 0, y = 0, width = 0, height = 0 } = node.dom.BBox;
  return Math.abs((this.x + this.width / 2) - (x + width / 2)) <= (this.width / 2 + width / 2) &&
    Math.abs((this.y + this.height / 2) - (y + height / 2)) <= (this.height / 2 + height / 2);
// ((this.x + this.width) >= node.x && (node.x + node.width) >= this.x && (this.y + this.height) >= node.y && (node.y + node.height) >= this.y)
}

Node.prototype.searchIn = function (CoOr) {
  return ((CoOr.x >= this.x && CoOr.x <= (this.x + this.width)) && (CoOr.y >= this.y && CoOr.y <= (this.y + this.height)));
};

Node.prototype.insertLeafNode = function (node) {
  if (this.nodes && this.nodes.length !== 0) {
    this.nodes.push(node);
  } else {
    this.nodes = [node];
  }
}

Node.prototype.insertNode = function (node) {
  let childCount = (this.children && this.children.length) || 0
  if (childCount) {
    for (let i = 0; i < childCount; i++) {
      let quadTreeObj = this.children[i];
      if (quadTreeObj.in(node)) {
        if (quadTreeObj.children && quadTreeObj.children.length === 0) {
          quadTreeObj.insertLeafNode(node);
        } else {
          quadTreeObj.insertNode(node);
        }
      }
    }
  } else {
    this.insertLeafNode(node);
  }
}

Node.prototype.removeNode = function (node) {
  let childCount = (this.children && this.children.length) || 0;
  if (childCount) {
    for (let i = 0; i < childCount; i++) {
      let quadTreeObj = this.children[i];
      if (quadTreeObj.in(node)) {
        quadTreeObj.removeNode(node);
      }
    }
  } else {
    let nodeIndex = node.nodes.findIndex((d) => {
      return d.x === node.x && d.y === node.y;
    });
    if (nodeIndex !== -1) {
      node.nodes.splice(nodeIndex, 1);
    }
  }
}

Node.prototype.searchNode = function (CoOr) {
  let searchedVal;
  let childCount = (this.children && this.children.length) || 0;
  if (childCount) {
    for (let i = childCount - 1; i >= 0; i--) {
      let quadTreeObj = this.children[i];
      if (quadTreeObj.searchIn(CoOr)) {
        searchedVal = quadTreeObj.searchNode(CoOr);
        if (searchedVal) {
          break;
        }
      }
    }
  } else {
    let nodes = this.nodes;
    for (let j = nodes.length - 1; j >= 0; j--) {
      if (nodes[j].in(CoOr)) {
        searchedVal = nodes[j];
        break;
      }
    }
  }
  return searchedVal;
}

function constructQuadTree (x, y, width, height, l_w, l_h) {
  let obj = new Node(x, y, width, height)
  if (width >= l_w && height >= l_h) {
    for (let i = 0; i < 4; i++) {
      let child = constructQuadTree(x + ((i % 2 !== 0) ? width / 2 : 0), y + ((i > 1) ? height / 2 : 0), width / 2, height / 2, l_w, l_h);
      if (child) {
        obj.children.push(child);
      }
    }
    return obj;
  } else {
    return obj;
  }
}

function QuadTree () {
}

QuadTree.prototype.create = function ({ x = 0, y = 0, width, height, l_w, l_h}) {
  this.quadTree = constructQuadTree(x, y, width, height, l_w, l_h);
}

QuadTree.prototype.addNode = function (node) {
  this.quadTree.insertNode(node);
}

QuadTree.prototype.removeNode = function (node) {
  this.quadTree.removeNode(node);
}

QuadTree.prototype.in = function (node) {
  let Snode = this.quadTree.searchNode(node)
  console.log(Snode);
  return Snode ? [Snode] : [];
}

export default QuadTree;
