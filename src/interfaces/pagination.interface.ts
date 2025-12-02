export interface ObjectLiteral {
  [s: string]: any;
}

export interface IPaginationLinks {
  /**
   * a link to the "first" page
   */
  first?: string;
  /**
   * a link to the "previous" page
   */
  previous?: string;
  /**
   * a link to the "next" page
   */
  next?: string;
  /**
   * a link to the "last" page
   */
  last?: string;
}

export interface IPaginationMeta extends ObjectLiteral {
  /**
   * the amount of items on this specific page
   */
  itemCount: number;
  /**
   * the total amount of items
   */
  totalItems?: number;
  /**
   * the amount of items that were requested per page
   */
  itemsPerPage: number;
  /**
   * the total amount of pages in this paginator
   */
  totalPages?: number;
  /**
   * the current page this paginator "points" to
   */
  currentPage: number;
}

export interface PaginatedResult<PaginationObject, T extends ObjectLiteral = IPaginationMeta> {
  /**
   * a list of items to be returned
   */
  items: PaginationObject[];
  /**
   * associated meta information (e.g., counts)
   */
  meta: T;
  /**
   * associated links
   */
  links?: IPaginationLinks;
}