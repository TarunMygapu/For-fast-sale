import { Routes, Route } from "react-router-dom";
import GenericNavTabs from "../../widgets/GenericNavTab/GenericNavTabs";
import ApplicationStatus from "../../components/ApplicationStatus/components/ApplicationStatusToSetCategory/ApplicationStatusToSetCategory";
import ApplicationSaleFormForSchool from "../../components/ApplicationSaleFormForSchool/ApplicationSaleFormForSchool";
import styles from "./MainContainer.module.css";

const MainContainer = () => {
    // Define tabs for navigation
    const tabs = [
        { id: 1, label: "Analytics", path: "/analytics" },
        { id: 2, label: "Distribute", path: "/distribute" },
        { id: 3, label: "Sale & Confirm", path: "/sale&confirm" },
        { id: 4, label: "Damage", path: "/damage" },
        // Add more tabs as needed
    ];

    return (
        <div className={styles.main_container}>
            <div className={styles.nav_tabs_wrapper}>
                <GenericNavTabs tabs={tabs} />
            </div>
            <Routes>
                <Route path="/" element={<div>Default content</div>} />
                <Route path="/analytics" element={<div>Analytics content</div>} />
                <Route path="/distribute" element={<div>Distribute content</div>} />
                <Route path="/sale&confirm" element={<ApplicationStatus />} />
                <Route path="/damage" element={<div>Damage content</div>} />
                <Route path="/school-application-sale" element={<ApplicationSaleFormForSchool />} />
            </Routes>
        </div>
    );
};

export default MainContainer;

