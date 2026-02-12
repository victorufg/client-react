import React from 'react';
import '../styles/Pagination.css';

const Pagination = ({
    itemsPerPage = 100,
    totalItems = 0,
    currentPage = 1,
    onPageChange,
    onItemsPerPageChange
}) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Don't render pagination if there's only 1 page or no items
    if (totalPages <= 1) return null;

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            onPageChange(page);
        }
    };

    const renderPageNumbers = () => {
        const pages = [];
        const maxVisibleButtons = 5;

        let startPage = Math.max(1, currentPage - Math.floor(maxVisibleButtons / 2));
        let endPage = Math.min(totalPages, startPage + maxVisibleButtons - 1);

        if (endPage - startPage + 1 < maxVisibleButtons) {
            startPage = Math.max(1, endPage - maxVisibleButtons + 1);
        }

        if (startPage > 1) {
            pages.push(
                <button key={1} className="page-num" onClick={() => handlePageChange(1)}>1</button>
            );
            if (startPage > 2) {
                pages.push(<span key="start-dots" className="dots">...</span>);
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button
                    key={i}
                    className={`page-num ${currentPage === i ? 'active' : ''}`}
                    onClick={() => handlePageChange(i)}
                >
                    {i}
                </button>
            );
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                pages.push(<span key="end-dots" className="dots">...</span>);
            }
            pages.push(
                <button
                    key={totalPages}
                    className="page-num"
                    onClick={() => handlePageChange(totalPages)}
                >
                    {totalPages}
                </button>
            );
        }

        return pages;
    };

    return (
        <div className="card pagination-card">
            <div className="rows-per-page">
                <span className="text-secondary">Mostrar</span>
                <select
                    className="pagination-select"
                    value={itemsPerPage}
                    onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                    <option value={200}>200</option>
                    <option value={500}>500</option>
                    <option value={1000}>1000</option>
                </select>
                <span className="text-secondary">registros</span>
                <span className="text-secondary" style={{ marginLeft: '10px', fontSize: '0.85rem' }}>
                    Total: {totalItems}
                </span>
            </div>

            <div className="page-controls">
                <button
                    className="page-btn"
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                >
                    &lt; Anterior
                </button>
                <div className="page-numbers">
                    {renderPageNumbers()}
                </div>
                <button
                    className="page-btn"
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                >
                    Próxima &gt;
                </button>
            </div>
        </div>
    );
};

export default Pagination;
