import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { Link } from "react-router-dom";
import './NoteCard.css';

const NoteCard = ({ id, title, shortNote, author, role }) => {
  // console.log(author);

  return (
    <Card className="note-card">
      <CardContent>
        <Typography variant="h6" className="note-title">
          {title}
        </Typography>
        <Typography variant="body1" className="note-content">
          {shortNote}
        </Typography>

        {role === 'admin' && author && (
          <div>

          <Typography variant="body2" className="note-author">
            Uploaded by: {author.fullName} ({author.username})
          </Typography>
          <Typography variant="body2" className="note-author">
            Role: {author.role}
          </Typography>
          </div>
        )}

        <Link className="note-file-button" to={`/mynotes/${id}`} rel="noopener noreferrer">
          View File
        </Link>
      </CardContent>
    </Card>
  );
};

export default NoteCard;
