import React, { useState } from "react";
import styles from "./SearchResultCardWithStatus.module.css";
import DivisionDesign from "../../assets/application-status/DivisionDesign.svg";
import Statusbar from "../../widgets/StatusBar/Statusbar";

const SearchResultCardWithStatus = ({ data, maxResults = 5, onCardClick, category = 'school' }) => {
  // Permission check removed - always allow clicking
  const canClickCard = true;
  const [hoveredCard, setHoveredCard] = useState(null);
 
  // Only enable hover menu for college category
  const isCollege = category?.toLowerCase()?.trim() === 'college';

  const displayData = (data || []).filter(
    (item) => item.displayStatus
  );
  const filteredData = displayData.slice(0, maxResults);
  
  const handleMenuOptionClick = (item, option, e) => {
    e.stopPropagation(); // Prevent card click
    console.log(`Selected ${option} for ${item.applicationNo}`);
    // You can add navigation logic here based on the option
    if (option === 'Sale') {
      // Navigate to sale page
    } else if (option === 'Fast Sale') {
      // Navigate to fast sale page
    }
    setHoveredCard(null); // Close menu after selection
  };

  return (
    <div className={styles.Search_Cards_recent_search}>
      <h3 className={styles.Search_Cards_recent_search__title}>Search Result</h3>
      <div className={styles.Search_Cards_recent_search__cards}>
        {filteredData.length > 0 ? (
          filteredData.map((item) => {
            const isConfirmed = item.displayStatus === "Confirmed";
            const isDisabledByStatus = isConfirmed;
            const isDisabledByPermission = !canClickCard;
            const isDisabled = isDisabledByStatus || isDisabledByPermission;
            const isHovered = hoveredCard === (item.id || item.applicationNo);
            
            return (
              <div
                key={item.id || item.applicationNo}
                className={styles.Search_Cards_recent_search__card_wrapper}
                onMouseEnter={() => isCollege && !isDisabled && setHoveredCard(item.id || item.applicationNo)}
                onMouseLeave={() => isCollege && setHoveredCard(null)}
              >
                {/* Overlay - only for college */}
                {isHovered && isCollege && (
                  <div 
                    className={styles.Search_Cards_recent_search__overlay}
                    onClick={() => setHoveredCard(null)}
                  />
                )}
                
                {/* Card */}
                <div
                  className={`${styles.Search_Cards_recent_search__card} ${isDisabled ? styles.disabled : ''} ${isHovered && isCollege ? styles.card_hovered : ''}`}
                onClick={() => !isDisabled && onCardClick && onCardClick(item)}
                style={{
                  cursor: isDisabled ? 'not-allowed' : 'pointer',
                  opacity: isDisabled ? 0.6 : 1
                }}
              >
              <figure className={styles.Search_Cards_recent_search__image}></figure>
              <p className={styles.Search_Cards_recent_search__id}>
                {item.applicationNo}
              </p>
              <p className={styles.Search_Cards_recent_search__Campus}>
                {item.campus}
              </p>
              <p className={styles.Search_Cards_recent_search__Zone}>
                {item.zone}
              </p>
              <figure className={styles.Search_Cards_recent_search__division}>
                <img src={DivisionDesign} alt="Division Design Icon" />
              </figure>
              <div className={styles.Search_Cards_recent_search__status}>
                <Statusbar
                  isSold={item.displayStatus === "Sold" || item.displayStatus === "Confirmed"}
                  isConfirmed={item.displayStatus === "Confirmed"}
                  isDamaged={item.displayStatus === "Damaged"}
                  singleStar={item.displayStatus === "Damaged"}
                />
              </div>
                </div>

                {/* Menu - only for college */}
                {isHovered && !isDisabled && isCollege && (
                  <div className={styles.Search_Cards_recent_search__menu}>
                    <button 
                      className={styles.Search_Cards_recent_search__close_btn}
                      onClick={(e) => {
                        e.stopPropagation();
                        setHoveredCard(null);
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <div className={styles.Search_Cards_recent_search__menu_options}>
                      <button
                        className={styles.Search_Cards_recent_search__menu_option}
                        onClick={(e) => handleMenuOptionClick(item, 'Sale', e)}
                      >
                        Sale
                      </button>
                      <button
                        className={styles.Search_Cards_recent_search__menu_option}
                        onClick={(e) => handleMenuOptionClick(item, 'Fast Sale', e)}
                      >
                        Fast Sale
                      </button>
                    </div>
                  </div>
                )}
            </div>
            );
          })
        ) : (
          <p className={styles.Search_Cards_recent_search__no_results}>
            No results found
          </p>
        )}
      </div>
    </div>
  );
};
 
export default SearchResultCardWithStatus;
 