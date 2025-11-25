import { useState, useMemo, useEffect } from 'react';
import ApplicationStatusTable from '../ApplicationStatusTable/ApplicationStatusTable';
import styles from '../../widgets/ApplicationStatusDataTable/ApplicationStatusDataTable.module.css';
import './Application_sale_with_table.css';

// Normalize status to a standard key
const normalizeStatus = (status) => {
    if (!status) return '';
    const normalized = status.toLowerCase().trim();
    
    // Map all variations to standard keys
    switch (normalized) {
        case 'sold':
        case 'not confirmed':
            return 'sold';
        case 'unsold':
            return 'unsold';
        case 'with pro':
        case 'withpro':
        case 'with_pro':
        case 'available':
            return 'withpro';
        case 'damaged':
        case 'broken':
            return 'damaged';
        case 'payment pending':
        case 'paymentpending':
        case 'payment_pending':
            return 'paymentpending';
        case 'fast sale':
        case 'fastsale':
        case 'fast_sale':
            return 'fastsale';
        case 'confirmed':
        case 'approved':
            return 'confirmed';
        default:
            return normalized;
    }
};

// Status mapping configuration
const statusConfig = {
    sold: {
        cssClass: styles.sold,
        displayStatus: 'Sold'
    },
    unsold: {
        cssClass: styles.unsold,
        displayStatus: 'Unsold'
    },
    withpro: {
        cssClass: styles.withpro,
        displayStatus: 'With PRO'
    },
    damaged: {
        cssClass: styles.damaged,
        displayStatus: 'Damaged'
    },
    paymentpending: {
        cssClass: styles.paymentpending,
        displayStatus: 'Payment Pending'
    },
    fastsale: {
        cssClass: styles.fastsale,
        displayStatus: 'Fast Sale'
    },
    confirmed: {
        cssClass: styles.confirmed,
        displayStatus: 'Confirmed'
    }
};

// Function to get status badge CSS class
const getStatusBadgeClass = (status) => {
    const normalized = normalizeStatus(status);
    return statusConfig[normalized]?.cssClass || '';
};

// Function to map status to displayStatus for SearchResultCardWithStatus
const mapStatusToDisplayStatus = (status) => {
    const normalized = normalizeStatus(status);
    return statusConfig[normalized]?.displayStatus || status;
};

const Application_sale_with_table = ({ 
    studentCategory, 
    selectedCampus, 
    pageIndex: externalPageIndex,
    setPageIndex: externalSetPageIndex,
    onDataChange,
    category = 'school',
    setSearch,
    navigate,
    handleNavigateToSalePage
}) => {
    const [internalPageIndex, setInternalPageIndex] = useState(0);
    
    // Use external pageIndex if provided, otherwise use internal state
    const pageIndex = externalPageIndex !== undefined ? externalPageIndex : internalPageIndex;
    const setPageIndex = externalSetPageIndex || setInternalPageIndex;

    // Default columns with custom status cell renderer
    const columns = [
        { accessorKey: "applicationNo", header: "Application No" },
        { accessorKey: "pro", header: "PRO" },
        { accessorKey: "campus", header: "Campus" },
        { accessorKey: "dgm", header: "DGM" },
        { accessorKey: "zone", header: "Zone" },
        { 
            accessorKey: "status", 
            header: "Status",
            cell: ({ getValue }) => {
                const status = getValue();
                const badgeClass = getStatusBadgeClass(status);
                return (
                    <span className={`${styles.Application_Status_Table_status_badge} ${badgeClass}`}>
                        {status}
                    </span>
                );
            }
        },
    ];

    // Sample data
    const allData = [
        { applicationNo: "APP001", pro: "PRO1", campus: "Campus A", dgm: "DGM1", zone: "Zone 1", status: "Available", isSelected: false },
        { applicationNo: "APP002", pro: "PRO2", campus: "Campus B", dgm: "DGM2", zone: "Zone 2", status: "Sold", isSelected: false },
        { applicationNo: "APP003", pro: "PRO3", campus: "Campus C", dgm: "DGM3", zone: "Zone 3", status: "Unsold", isSelected: false },
        { applicationNo: "APP004", pro: "PRO4", campus: "Campus D", dgm: "DGM4", zone: "Zone 4", status: "With PRO", isSelected: false },
        { applicationNo: "APP005", pro: "PRO5", campus: "Campus E", dgm: "DGM5", zone: "Zone 5", status: "Damaged", isSelected: false },
        { applicationNo: "APP006", pro: "PRO6", campus: "Campus F", dgm: "DGM6", zone: "Zone 6", status: "Payment Pending", isSelected: false },
        { applicationNo: "APP007", pro: "PRO7", campus: "Campus G", dgm: "DGM7", zone: "Zone 7", status: "Fast Sale", isSelected: false },
        { applicationNo: "APP008", pro: "PRO1", campus: "Campus A", dgm: "DGM1", zone: "Zone 1", status: "Available", isSelected: false },
        { applicationNo: "APP009", pro: "PRO2", campus: "Campus B", dgm: "DGM2", zone: "Zone 2", status: "Sold", isSelected: false },
        { applicationNo: "APP010", pro: "PRO3", campus: "Campus C", dgm: "DGM3", zone: "Zone 3", status: "Unsold", isSelected: false },
        { applicationNo: "APP011", pro: "PRO4", campus: "Campus D", dgm: "DGM4", zone: "Zone 4", status: "With PRO", isSelected: false },
        { applicationNo: "APP012", pro: "PRO5", campus: "Campus E", dgm: "DGM5", zone: "Zone 5", status: "Damaged", isSelected: false },
        { applicationNo: "APP013", pro: "PRO6", campus: "Campus F", dgm: "DGM6", zone: "Zone 6", status: "Payment Pending", isSelected: false },
        { applicationNo: "APP014", pro: "PRO7", campus: "Campus G", dgm: "DGM7", zone: "Zone 7", status: "Fast Sale", isSelected: false },
    ];

    // Apply filters to data
    const data = useMemo(() => {
        let filtered = [...allData];

        // Apply campus filter
        if (selectedCampus && selectedCampus !== "All Campuses") {
            filtered = filtered.filter(item => 
                item.campus === selectedCampus
            );
        }

        // Apply status filter
        if (studentCategory) {
            const isAllSelected =
                studentCategory.all &&
                !studentCategory.sold &&
                !studentCategory.confirmed &&
                !studentCategory.unsold &&
                !studentCategory.withPro &&
                !studentCategory.damaged;

            if (!isAllSelected) {
                filtered = filtered.filter((item) => {
                    const status = item.status?.toLowerCase() || "";
                    const normalizedStatus = status.trim();
                    
                    // Map status values to match filter categories
                    let matches = false;
                    
                    // Sold filter: "Sold" status
                    if (studentCategory.sold && normalizedStatus === "sold") {
                        matches = true;
                    }
                    
                    // Confirmed filter: "Confirmed" status
                    if (studentCategory.confirmed && normalizedStatus === "confirmed") {
                        matches = true;
                    }
                    
                    // Unsold filter: "Unsold" status
                    if (studentCategory.unsold && normalizedStatus === "unsold") {
                        matches = true;
                    }
                    
                    // With PRO filter: "With PRO", "Available" statuses
                    if (studentCategory.withPro && (
                        normalizedStatus === "with pro" || 
                        normalizedStatus === "available" || 
                        normalizedStatus === "withpro"
                    )) {
                        matches = true;
                    }
                    
                    // Damaged filter: "Damaged" status
                    if (studentCategory.damaged && normalizedStatus === "damaged") {
                        matches = true;
                    }
                    
                    return matches;
                });
            }
        }

        return filtered;
    }, [studentCategory, selectedCampus]);

    // Notify parent component when data changes (for search functionality)
    useEffect(() => {
        if (onDataChange) {
            // Map data to include displayStatus for SearchResultCardWithStatus
            const dataWithDisplayStatus = data.map(item => ({
                ...item,
                displayStatus: mapStatusToDisplayStatus(item.status)
            }));
            onDataChange(dataWithDisplayStatus);
        }
    }, [data, onDataChange]);

    const handleSelectRow = (row, checked) => {
        console.log("Row selected:", row, checked);
    };

    const handleNavigateToSale = (row) => {
        // Check category and handle accordingly
        const normalizedCategory = category?.toLowerCase()?.trim();
        
        if (normalizedCategory === 'college') {
            // For college: show search card for this application
            if (setSearch && row?.applicationNo) {
                setSearch(row.applicationNo);
            }
        } else {
            // For school (default): navigate to another page
            if (handleNavigateToSalePage) {
                handleNavigateToSalePage(row);
            } else if (navigate && row?.applicationNo) {
                navigate('/school-application-sale', {
                    state: { applicationData: row }
                });
            }
        }
    };

    const handleNavigateToConfirmation = (row) => {
        console.log("Navigate to confirmation:", row);
    };

    const handleNavigateToDamage = (row) => {
        console.log("Navigate to damage:", row);
    };

    return (
        <div>
            <div>
                <ApplicationStatusTable
                    columns={columns}
                    data={data}
                    onSelectRow={handleSelectRow}
                    onNavigateToSale={handleNavigateToSale}
                    onNavigateToConfirmation={handleNavigateToConfirmation}
                    onNavigateToDamage={handleNavigateToDamage}
                    pageIndex={pageIndex}
                    setPageIndex={setPageIndex}
                    totalData={data.length}
                />
            </div>
        </div>
    );

};

export default Application_sale_with_table;