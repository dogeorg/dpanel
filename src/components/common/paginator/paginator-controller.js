export class PaginationController {
  constructor(host, data = [], itemsPerPage = 10) {
    this.host = host;
    this.data = data;
    this.itemsPerPage = itemsPerPage;
    this.currentPage = 1;
  }

  setData(newData) {
    this.data = newData;
    this.currentPage = 1;
    this.host.requestUpdate();
  }

  nextPage = () => {
    const totalPages = Math.ceil(this.data.length / this.itemsPerPage);
    if (this.currentPage < totalPages) {
      this.currentPage++;
      this.host.requestUpdate();
    }
  }

  previousPage = () => {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.host.requestUpdate();
    }
  }

  getCurrentPageData() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.data.slice(startIndex, endIndex);
  }

  getTotalPages() {
    return Math.ceil(this.data.length / this.itemsPerPage);
  }

  setCurrentPage(page) {
    const totalPages = this.getTotalPages();
    if (page >= 1 && page <= totalPages) {
      this.currentPage = page;
      this.host.requestUpdate();
    }
  }
}