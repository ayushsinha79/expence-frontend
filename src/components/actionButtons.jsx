function ActionButtons({
    onLogout,
    onAddTransaction,
  }) {
    return (
      <>
        <button onClick={onLogout}>
          Logout
        </button>
  
        <button onClick={onAddTransaction}>
          Add Transaction
        </button>
      </>
    );
  }
  
  export default ActionButtons;