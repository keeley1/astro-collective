// EDIT THIS AND WHERE IT IS LOCATED

module.exports = function formatDate(dateString) {
    if (dateString) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', options);
    }
    return 'N/A';
};

// space time formatting

// astronaut age calculator
