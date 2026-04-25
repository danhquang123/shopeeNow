import React from 'react';

const Filter = ({
    searchTerm, setSearchTerm,
    selectedCategory, setSelectedCategory,
    sortType, setSortType,
    categories, handleClearFilter
}) => {
    return (
        <div className="custom-toolbar">
            <style>{`
                .custom-toolbar { 
                    display: flex; 
                    align-items: center; 
                    gap: 15px; 
                    background: white; 
                    padding: 15px 25px; 
                    border-radius: 12px; 
                    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
                    margin-bottom: 30px;
                }
                .search-box { flex-grow: 1; border: 1px solid #ddd; border-radius: 8px; padding: 8px 15px; }
                .filter-select { 
                    min-width: 150px; 
                    border: 1px solid #ddd; 
                    border-radius: 8px; 
                    padding: 8px;
                    background: #f9f9f9;
                    cursor: pointer;
                }
                .btn-clear { 
                    background: #7b113a; 
                    color: white; 
                    border: none; 
                    padding: 8px 18px; 
                    border-radius: 8px; 
                    font-weight: 500;
                    transition: 0.3s;
                }
                .btn-clear:hover { background: #a21a4d; }
            `}</style>

            {/* Ô tìm kiếm */}
            <input
                type="text"
                className="search-box"
                placeholder="Search Products"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            {/* Chọn Category */}
            <select
                className="filter-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
            >
                <option value="All">All Categories</option>
                {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                ))}
            </select>

            {/* Chọn Sắp xếp */}
            <select
                className="filter-select"
                value={sortType}
                onChange={(e) => setSortType(e.target.value)}
            >
                <option value="default">Sort By</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
            </select>

            {/* Nút Xóa lọc */}
            <button className="btn-clear" onClick={handleClearFilter}>
                Clear Filter
            </button>
        </div>
    );
};

export default Filter;