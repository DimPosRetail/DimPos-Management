import FinancialShiftTable from "./components/financial-shift-table";

const FinancialShiftPage = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">Ca tài chính</h1>
      </div>
      <FinancialShiftTable/>
    </div>
  );
};

export default FinancialShiftPage;
