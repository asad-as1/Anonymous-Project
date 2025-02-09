import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { Link } from "react-router-dom";
import './NoteCard.css';

const NoteCard = ({ id, title, shortNote, fileUrl }) => {
  return (
    <Card className="note-card">
      <CardContent>
        <Typography variant="h6" className="note-title">
          {title}
        </Typography>
        <Typography variant="body1" className="note-content">
          {shortNote}
        </Typography>
        
          <Link
            className="note-file-button"
            to={`/mynotes/${id}`}
            rel="noopener noreferrer"
          >
            View File
          </Link>
        
      </CardContent>
    </Card>
  );
};

export default NoteCard;
