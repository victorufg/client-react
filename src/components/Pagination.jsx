import React from 'react';
import '../styles/Pagination.css';

const Pagination = () => {
    return (
        <div className="card pagination-card">
            <div className="rows-per-page">
                <span className="text-secondary">Mostrar</span>
                <select className="pagination-select">
                    <option>100</option>
                    <option>200</option>
                    <option>300</option>
                    <option>500</option>
                    <option>1000</option>
                </select>
                <span className="text-secondary">registros</span>
            </div>

            <div className="page-controls">
                <button className="page-btn" disabled>
                    &lt; Anterior
                </button>
                <div className="page-numbers">
                    <button className="page-num active">1</button>
                    <button className="page-num">2</button>
                    <button className="page-num">3</button>
                    <span className="dots">...</span>
                    <button className="page-num">10</button>
                </div>
                <button className="page-btn">
                    Próxima &gt;
                </button>
            </div>
        </div>
    );
};

export default Pagination;
