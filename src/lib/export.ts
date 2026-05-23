import jsPDF from 'jspdf';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
}

export function exportChatToJSON(messages: ChatMessage[], filename: string = 'chat-export.json') {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(messages, null, 2));
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", filename);
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}

export function exportChatToTXT(messages: ChatMessage[], filename: string = 'chat-export.txt') {
  const textContent = messages.map(m => `[${new Date(m.timestamp).toLocaleString()}] ${m.role.toUpperCase()}:\n${m.content}\n\n`).join('');
  const dataStr = "data:text/plain;charset=utf-8," + encodeURIComponent(textContent);
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", filename);
  document.body.appendChild(downloadAnchorNode);
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}

export function exportChatToPDF(messages: ChatMessage[], filename: string = 'chat-export.pdf') {
  const doc = new jsPDF();
  let yPos = 10;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 10;
  const maxLineWidth = doc.internal.pageSize.width - margin * 2;

  doc.setFontSize(16);
  doc.text("AI Dev Master Chat Export", margin, yPos);
  yPos += 10;

  doc.setFontSize(10);

  messages.forEach((msg) => {
    const roleText = `[${new Date(msg.timestamp).toLocaleString()}] ${msg.role.toUpperCase()}:`;
    doc.setFont("helvetica", "bold");
    
    if (yPos > pageHeight - 20) {
      doc.addPage();
      yPos = 10;
    }
    
    doc.text(roleText, margin, yPos);
    yPos += 6;

    doc.setFont("helvetica", "normal");
    const splitText = doc.splitTextToSize(msg.content, maxLineWidth);
    
    for (let i = 0; i < splitText.length; i++) {
      if (yPos > pageHeight - 10) {
        doc.addPage();
        yPos = 10;
      }
      doc.text(splitText[i], margin, yPos);
      yPos += 5;
    }
    yPos += 5; // Extra space between messages
  });

  doc.save(filename);
}
