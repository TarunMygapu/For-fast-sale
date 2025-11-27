import React, { useState, useRef, useEffect } from "react";
import styles from "./SearchResultCardWithStatus.module.css";
import DivisionDesign from "../../assets/application-status/DivisionDesign.svg";
import Statusbar from "../../widgets/StatusBar/Statusbar";
import PopupcloseIcon from "../../assets/kindOfSaleIcons/PopupcloseIcon.svg";
import ApplicationSaleIcon from "../../assets/kindOfSaleIcons/ApplicationSaleIcon.svg";
import ApplicationFastSaleIcon from "../../assets/kindOfSaleIcons/ApplicationFastSaleIcon.svg";
 
const SearchResultCardWithStatus = ({ data, maxResults = 5, onCardClick, category = 'school' }) => {
  // Permission check removed - always allow clicking
  const canClickCard = true;
  const [hoveredCard, setHoveredCard] = useState(null);
  const hoverTimeoutRef = useRef(null);

  // Only enable hover menu for college category
  const isCollege = category?.toLowerCase()?.trim() === 'college';

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const displayData = (data || []).filter(
    (item) => item.displayStatus
  );
  const filteredData = displayData.slice(0, maxResults);
  
  const closeMenu = () => {
    // Clear any pending timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setHoveredCard(null);
  };

  const handleMenuOptionClick = (item, option, e) => {
    e.stopPropagation(); // Prevent card click
    console.log(`Selected ${option} for ${item.applicationNo}`);
    // You can add navigation logic here based on the option
    if (option === 'Sale') {
      // Navigate to sale page
    } else if (option === 'Fast Sale') {
      // Navigate to fast sale page
    }
    closeMenu(); // Close menu after selection
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
            
            const handleMouseEnter = () => {
              if (isCollege && !isDisabled) {
                // Clear any existing timeout
                if (hoverTimeoutRef.current) {
                  clearTimeout(hoverTimeoutRef.current);
                }
                // Set timeout for 2 seconds delay
                hoverTimeoutRef.current = setTimeout(() => {
                  setHoveredCard(item.id || item.applicationNo);
                }, 1000);
              }
            };

            const handleMouseLeave = () => {
              if (isCollege) {
                closeMenu();
              }
            };

            return (
              <div
                key={item.id || item.applicationNo}
                className={styles.Search_Cards_recent_search__card_wrapper}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                {/* Overlay - only for college */}
                {isHovered && isCollege && (
                  <div 
                    className={styles.Search_Cards_recent_search__overlay}
                    onClick={closeMenu}
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

                {/* Close Icon - between card and menu */}
                {!isDisabled && isCollege && (
                  <div 
                    className={`${styles.Search_Cards_recent_search__close_icon_wrapper} ${isHovered ? styles.visible : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      closeMenu();
                    }}
                  >
                    <img 
                      src={PopupcloseIcon} 
                      alt="Close" 
                      className={styles.Search_Cards_recent_search__close_icon}
                    />
                  </div>
                )}

                {/* Menu - only for college */}
                {!isDisabled && isCollege && (
                  <div className={`${styles.Search_Cards_recent_search__menu} ${isHovered ? styles.visible : ''}`}>
                    <div className={styles.Search_Cards_recent_search__menu_options}>
                      <button
                        className={styles.Search_Cards_recent_search__menu_option}
                        onClick={(e) => handleMenuOptionClick(item, 'Sale', e)}
                      >
                        <img src={ApplicationSaleIcon} alt="Sale" className={styles.Search_Cards_recent_search__menu_icon} />
                        <span>Application Sale</span>
                      </button>
                      <button
                        className={styles.Search_Cards_recent_search__menu_option}
                        onClick={(e) => handleMenuOptionClick(item, 'Fast Sale', e)}
                      >
                        <img src={ApplicationFastSaleIcon} alt="Fast Sale" className={styles.Search_Cards_recent_search__menu_icon} />
                        <span>Application Fast Sale</span>
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
 