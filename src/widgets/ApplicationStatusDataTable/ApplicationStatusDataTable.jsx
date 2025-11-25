import React, { useState, useRef, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { Modal, IconButton, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import styles from "./ApplicationStatusDataTable.module.css";

const ApplicationStatusDataTable = ({
  columns = [],
  data = [],
  onUpdate,
  onSelectRow,
  pageIndex = 0,
  setPageIndex,
  pageSize = 10,
  totalData = 0,
  fieldMapping = {},
  formComponent: FormComponent,
  onNavigateToSale,
  onNavigateToConfirmation,
  onNavigateToDamage,
}) => {
  // Derive totals and paging
  const totalPages = Math.max(Math.ceil(totalData / pageSize), 1);

  const table = useReactTable({
    data: data || [],
    columns: columns || [],
    getCoreRowModel: getCoreRowModel(),
  });

  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [internalPageIndex, setInternalPageIndex] = useState(pageIndex || 0);

  // Use internal state if setPageIndex is not provided
  const currentPageIndex = setPageIndex !== undefined ? pageIndex : internalPageIndex;

  const handlePageIndexChange = (newIndexOrUpdater) => {
    if (setPageIndex) {
      if (typeof newIndexOrUpdater === 'function') {
        setPageIndex(newIndexOrUpdater);
      } else {
        setPageIndex(newIndexOrUpdater);
      }
    } else {
      if (typeof newIndexOrUpdater === 'function') {
        setInternalPageIndex(newIndexOrUpdater);
      } else {
        setInternalPageIndex(newIndexOrUpdater);
      }
    }
  };

  const isIndeterminate =
    table.getRowModel().rows.some((r) => r.original.isSelected) &&
    !table.getRowModel().rows.every((r) => r.original.isSelected);

  const mapRowDataToInitialValues = (rowData) => {
    if (!rowData) return {};
    const mappedValues = {};
    Object.entries(fieldMapping).forEach(([tableField, formField]) => {
      mappedValues[formField] = rowData[tableField] || "";
    });
    return { ...rowData, ...mappedValues };
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedRow(null);
  };

  const handleFormSubmit = (values) => {
    if (!selectedRow) return;
    const updatedRow = { ...selectedRow };
    Object.entries(fieldMapping).forEach(([tableField, formField]) => {
      updatedRow[tableField] = values[formField] || updatedRow[tableField];
    });
    onUpdate?.(updatedRow);
    handleClose();
  };

  const handleStatusUpdate = (rowData, status) => {
    // Normalize status to handle case variations
    const normalizedStatus = status?.toLowerCase()?.trim();

    switch (normalizedStatus) {
      case "with pro":
      case "available":
        onNavigateToSale?.(rowData);
        break;
      case "sold":
      case "not confirmed":
        onNavigateToConfirmation?.(rowData);
        break;
      case "payment pending":
      case "payment_pending":
      case "paymentpending":
        onNavigateToConfirmation?.(rowData);
        break;
      case "damaged":
        onNavigateToDamage?.(rowData);
        break;
      case "fast sale":
      case "fastsale":
      case "fast_sale":
        onNavigateToSale?.(rowData); // Navigate to sale for fast sale completion
        break;
      case "confirmed":
        // Button is disabled for confirmed status, no action needed
        break;
      default:
        onNavigateToSale?.(rowData);
        break;
    }
  };

  // Function to get dynamic button text based on status
  const getButtonText = (status) => {
    const normalizedStatus = status?.toLowerCase()?.trim();

    switch (normalizedStatus) {
      case "damaged":
      case "broken":
        return "Update";
      case "sold":
      case "not confirmed":
        return "To Confirm";
      case "with pro":
      case "available":
      case "withpro":
      case "with_pro":
        return "To Sold";
      case "payment pending":
      case "payment_pending":
      case "paymentpending":
        return "Pay";
      case "fast sale":
      case "fastsale":
      case "fast_sale":
        return "To Complete";
      case "confirmed":
      case "approved":
        return "Update";
      default:
        return "Update";
    }
  };

  // Header checkbox (page scope)
  const allSelected =
    table.getRowModel().rows.length > 0 &&
    table.getRowModel().rows.every((r) => r.original.isSelected);

  const headerCheckboxRef = useRef(null);
  useEffect(() => {
    if (headerCheckboxRef.current) {
      headerCheckboxRef.current.indeterminate = isIndeterminate;
    }
  }, [isIndeterminate]);

  // pagination disabled states
  const prevDisabled = currentPageIndex === 0;
  const nextDisabled = currentPageIndex + 1 >= totalPages;

  return (
    <div className={styles.table_wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.empty_head_column}>
              <input
                type="checkbox"
                ref={headerCheckboxRef}
                className={styles.custom_checkbox}
                checked={allSelected}
                onChange={(e) => {
                  const checked = e.target.checked;
                  table.getRowModel().rows.forEach((r) =>
                    onSelectRow?.(r.original, checked)
                  );
                }}
              />
            </th>
            {table.getHeaderGroups().map((headerGroup) =>
              headerGroup.headers.map((header) => (
                <th key={header.id} className={styles.table_header}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))
            )}
            <th className={styles.table_header_empty}></th>
          </tr>
        </thead>
        <tbody className={styles.table_body}>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className={styles.table_row}>
              <td className={styles.checkbox_cell}>
                <input
                  type="checkbox"
                  className={styles.custom_checkbox}
                  checked={row.original.isSelected || false}
                  onChange={(e) => onSelectRow?.(row.original, e.target.checked)}
                />
              </td>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className={styles.table_cell}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
              <td className={styles.table_cell}>
                <button
                  onClick={() => handleStatusUpdate(row.original, row.original.status)}
                  className={styles.update_btn}
                  disabled={
                    row.original.status?.toLowerCase()?.trim() === "confirmed"
                  }
                >
                  {getButtonText(row.original.status)}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className={styles.pagination_content}>
        <span className={styles.pagination_content_left}>
          Showing{" "}
          <span className={styles.pagination_highlight}>
            {currentPageIndex * pageSize + 1} to{" "}
            {Math.min((currentPageIndex + 1) * pageSize, totalData)}
          </span>{" "}
          of <span className={styles.pagination_highlight}>{totalData}</span> Entries
        </span>
        <div className={styles.pagination_content_right}>
          <span className={styles.pagination_info}>
            {currentPageIndex + 1} - {Math.ceil(totalData / pageSize)} of{" "}
            {Math.ceil(totalData / pageSize)}
          </span>
          <div className={styles.pagination_buttons}>
            <button
              type="button"
              onClick={() => handlePageIndexChange((prev) => Math.max(prev - 1, 0))}
              disabled={prevDisabled}
              className={`${styles.prevButton} ${prevDisabled ? styles.prevButtonDisabled : ""
                }`}
            >
              Prev
            </button>
            <button
              type="button"
              onClick={() =>
                handlePageIndexChange((prev) =>
                  prev + 1 < totalPages ? prev + 1 : prev
                )
              }
              disabled={nextDisabled}
              className={`${styles.nextButton} ${nextDisabled ? styles.nextButtonDisabled : ""
                }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="update-form-modal"
        aria-describedby="update-form-modal-description"
      >
        <Box className={styles.modal}>
          <div className={styles.modal_top}>
            <div className={styles.modal_top_left}>
              <p className={styles.modal_heading}>Update Application</p>
              <p className={styles.modal_sub}>
                Update application details
              </p>
            </div>
            <IconButton
              onClick={handleClose}
              className={styles.xicon}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </div>
          <div className={styles.modal_form}>
            {selectedRow && FormComponent && (
              <FormComponent
                onSubmit={handleFormSubmit}
                initialValues={mapRowDataToInitialValues(selectedRow)}
              />
            )}
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default ApplicationStatusDataTable;
