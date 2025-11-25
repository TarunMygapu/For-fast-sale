import React from 'react';
import styles from '../ApplicationStatus.module.css';
import Application_sale_with_table from '../../Application_sale_with_table_component/Application_sale_with_table';
import SearchResultCardWithStatus from '../../SearchResultCardWithStatus/SearchResultCardWithStatus';

const ApplicationStatusContent = ({
  search,
  filteredData,
  pageIndex,
  setPageIndex,
  handleCardClick,
  setData,
  studentCategory,
  selectedCampus,
  category,
  setSearch,
  navigate,
  handleNavigateToSalePage
}) => {
  // If there's a search query, show search results
  if (search) {
    return filteredData.length === 0 ? (
      <p className={styles["application-status__no-results"]}>
        No results found for "{search}"
      </p>
    ) : (
      <SearchResultCardWithStatus
        data={filteredData}
        maxResults={5}
        onCardClick={handleCardClick}
        category={category}
      />
    );
  }

  // Always show the table when there's no search, pass filters to it
    return (
    <Application_sale_with_table 
      studentCategory={studentCategory}
      selectedCampus={selectedCampus}
      pageIndex={pageIndex}
      setPageIndex={setPageIndex}
      onDataChange={setData}
      category={category}
      setSearch={setSearch}
      navigate={navigate}
      handleNavigateToSalePage={handleNavigateToSalePage}
    />
  );
};

export default ApplicationStatusContent;
