// src/utils/pagination.ts
export class Pagination {
  private page: number;
  private limit: number;
  private offset: number;

  constructor(page: number, limit: number) {
    if (page < 1 || limit < 1) {
      throw new Error('Page and limit must be positive integers');
    }
    this.page = page;
    this.limit = limit;
    this.offset = (page - 1) * limit;
  }

  public getOffset(): number {
    return this.offset;
  }

  public getLimit(): number {
    return this.limit;
  }

  public getPaginationInfo(totalCount: number): { totalPages: number; totalCount: number } {
    const totalPages = Math.ceil(totalCount / this.limit);
    return {
      totalPages,
      totalCount,
    };
  }
}
