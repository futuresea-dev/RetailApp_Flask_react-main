import React, { useEffect } from "react";
import { Pagination } from "react-headless-pagination";

const TableFooter = ({ range, setPage, page, slice, lastPage }) => {
  useEffect(() => {
    if (slice.length < 1 && page !== 1) {
      setPage(page - 1);
    }
  }, [slice, page, setPage]);

  return (
    <Pagination
      currentPage={page}
      setCurrentPage={setPage}
      totalPages={lastPage}
      edgePageCount={2}
      middlePagesSiblingCount={2}
      className="pagination-item"
      truncableText="..."
      truncableClassName=""
    >
      <Pagination.PrevButton className="">Previous</Pagination.PrevButton>

      <div className="page-number">
        <Pagination.PageButton
          activeClassName=""
          inactiveClassName=""
          className=""
        />
      </div>

      <Pagination.NextButton className="">Next</Pagination.NextButton>
    </Pagination>
  );
};

export default TableFooter;