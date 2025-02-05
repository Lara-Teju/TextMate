import React from 'react';
import jsPDF from 'jspdf';

const ExportButton = ({ notes }) => {
  const handleExport = () => {
    const doc = new jsPDF();
    notes.forEach((note, idx) => {
      doc.text(`Heading: ${note.heading}`, 10, 10 + idx * 20);
      note.subheadings.forEach((sub, i) => {
        doc.text(`  Subheading: ${sub.subheading}`, 10, 20 + idx * 30 + i * 10);
        doc.text(`    Summary: ${sub.content.summary}`, 10, 30 + idx * 30 + i * 10);
      });
    });
    doc.save('Cornell_Notes.pdf');
  };

  return <button onClick={handleExport}>Download Notes</button>;
};

export default ExportButton;
