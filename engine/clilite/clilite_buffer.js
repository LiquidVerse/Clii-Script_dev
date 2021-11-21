class clilite_Buffer {
  constructor(str) {
    this.str = str
    this.idx = 0
  }

  exist() {
    if (this.idx < 0) {
      return false
    }
    if (this.str.length <= this.idx) {
      return false
    }
    return true
  }

  read() {
    return this.str.substr(this.idx, 1)
  }
  next() {
    return this.str.substr(this.idx++, 1)
  }
}

module.exports = clilite_Buffer