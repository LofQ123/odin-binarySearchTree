import "./styles.css";

class Node {
  constructor(data) {
    this.data = data;
    this.left = null;
    this.right = null
  }
}

class Tree {
  constructor(array) {
    this.root = this.buildTree(array, 0, array.length - 1);
  }

  buildTree(array, start, end) {
    if (start > end) {
      return null
    } else {
      let midPoint = Math.floor((start + end)/2);
      let node = new Node(array[midPoint]);
      node.left = this.buildTree(array, start, midPoint - 1);
      node.right = this.buildTree(array, midPoint + 1, end);
      return node
    }
  }

  insert(value) {
    let current = this.root;
    while (current.data < value && current.right || current.data > value && current.left) {
      if (current.data < value && current.right) current = current.right;
      else if (current.data > value && current.left) current = current.left;
    }
    if (current.data === value) return null

    let newNode = new Node(value);
    if (current.data < value) {
      current.right = newNode;
    }
    else {
      current.left = newNode;
    } 
  }

  _search(value) {
    let current = this.root;
    let parent = this;
    while (current.data !==value && current.right || current.data !==value && current.left) {
      if (current.data < value && current.right) {
        parent = current;
        current = current.right;
      } else if (current.data > value && current.left) {
        parent = current;
        current = current.left;
      } 
    }
    if (current.data === value) {
      return { "current": current, "parent": parent, "found": true, }
    } else {
      return { "current": null, "parent": current }
    }
  }

  _isRoot(value) {
    if (this._search(value).parent.root) return true
    else return false
  }

  _getNumberOfChildren(node) {
    if (!node.left && !node.right) return 0;
    else if (!node.left && node.right || !node.right && node.left) return 1
    else return 2
  }

  _getReplacementNode(node) {
    let replacement = node.right;
    while(replacement.left) replacement = replacement.left
    return replacement
  }

  find(value) {
    return this._search(value).current
  }

  deleteItem(value) {
    const searchResult = this._search(value);
    if(!searchResult.current) return null

    const nodeToDelete = searchResult.current;
    const parentNode = searchResult.parent
    const numberOfChildren = this._getNumberOfChildren(nodeToDelete)
    
    if (this._isRoot(value)) {
      if (numberOfChildren === 0) {
        this.root = null;
      } else if (numberOfChildren === 1) {
        let childNode = null;
        nodeToDelete.left ? childNode = nodeToDelete.left : childNode = nodeToDelete.right;
        this.root = childNode;
      } else if (numberOfChildren === 2) {
        const replacement = this._getReplacementNode(nodeToDelete);
        const tempData = replacement.data;
        this.deleteItem(replacement.data);
        nodeToDelete.data = tempData;
      }
    } else {
      if (numberOfChildren === 0) {
        nodeToDelete.data < parentNode.data ? parentNode.left = null : parentNode.right = null;
      } else if (numberOfChildren === 1) {
        let childNode = null;
        nodeToDelete.left ? childNode = nodeToDelete.left : childNode = nodeToDelete.right;
        nodeToDelete.data < parentNode.data ? parentNode.left = childNode : parentNode.right = childNode;
      } else if (numberOfChildren === 2) {
        const replacement = this._getReplacementNode(nodeToDelete);
        const tempData = replacement.data;
        this.deleteItem(replacement.data);
        nodeToDelete.data = tempData
      }
    }
  }

  levelOrder(callback) {
    if (!callback) throw Error("Callback is required")
    const queue = [this.root];
    
    while (queue.length > 0) {
      let node = queue.shift();
      if(node.left) queue.push(node.left);
      if(node.right) queue.push(node.right);
      callback(node);
    }
  }

  preOrder(callback) {
    if (!callback) throw Error("Callback is required");
    let node = this.root;

    function traverse(node) {
      if (!node) return
      callback(node);
      traverse(node.left);
      traverse(node.right);
    }

    traverse(node)
  }

  inOrder(callback) {
    if (!callback) throw Error("Callback is required");
    let node = this.root;

    function traverse(node) {
      if(!node) return
      traverse(node.left);
      callback(node);
      traverse(node.right);
    }

    traverse(node)
  }

  postOrder(callback) {
    if (!callback) throw Error("Callback is required");
    let node = this.root;

    function traverse(node) {
      if(!node) return
      traverse(node.left);
      traverse(node.right);
      callback(node);
    }

    traverse(node)
  }

  height(node) {
    let height = 0;
    let counter = -1;

    function traverse(node, counter) {
      if(!node) return
      counter++;
      if (counter > height) height = counter;
      traverse(node.left, counter);
      traverse(node.right, counter);
    }

    traverse(node, counter)
    return height;
  }

  depth(node) {
    let depth = 0;
    let counter = 0;
    const target = node.data

    function traverse(node, counter) {
      if(!node) return
      if (node.data === target) {
        depth = counter;
        return
      } else {
        counter++;
        traverse(node.left, counter);
        traverse(node.right, counter)
      }
    }

    traverse(this.root, counter)
    return depth
  }

  isBalanced() {
    let isBalanced = true;
    let height = this.height;

    function traverse(node) {
      if(!node) return
      let leftHeight = height(node.left);
      let rightHeight = height(node.right);
      if(leftHeight - rightHeight >= 2 || leftHeight - rightHeight <= -2) {
        isBalanced = false;
        return
      } else {
        traverse(node.left)
        traverse(node.right)
      }
    }

    traverse(this.root)
    return isBalanced
  }

  rebalance() {
    const newArr = [];
    this.inOrder((node) => newArr.push(node.data))
    this.root = this.buildTree(newArr, 0, newArr.length - 1)
  }

  prettyPrint(node, prefix = "", isLeft = true) {
    if (node === null) {
      return;
    }
    if (node.right !== null) {
      this.prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
    }
    console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
    if (node.left !== null) {
      this.prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
    }
  }; 
}