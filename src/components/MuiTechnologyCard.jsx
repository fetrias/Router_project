import React from 'react';
import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Button,
    Chip,
    Box,
    IconButton
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

function MuiTechnologyCard({ technology, onEdit, onDelete, onStatusChange }) {
    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'success';
            case 'in-progress': return 'warning';
            default: return 'default';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'completed': return 'Завершено';
            case 'in-progress': return 'В процессе';
            default: return 'Не начато';
        }
    };

    return (
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="h5" component="h2" gutterBottom>
                        {technology.title}
                    </Typography>
                    <Box>
                        <IconButton size="small" onClick={() => onEdit(technology)} aria-label="Редактировать">
                            <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={() => onDelete(technology.id)} aria-label="Удалить">
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </Box>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {technology.description}
                </Typography>

                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip
                        label={getStatusText(technology.status)}
                        color={getStatusColor(technology.status)}
                        size="small"
                    />
                </Box>
            </CardContent>

            <CardActions>
                {technology.status !== 'completed' && (
                    <Button
                        size="small"
                        variant="contained"
                        onClick={() => onStatusChange(technology.id, 'completed')}
                    >
                        Завершить
                    </Button>
                )}

                <Button
                    size="small"
                    variant="outlined"
                    onClick={() => onStatusChange(technology.id,
                        technology.status === 'in-progress' ? 'not-started' : 'in-progress')}
                >
                    {technology.status === 'in-progress' ? 'Приостановить' : 'Начать'}
                </Button>
            </CardActions>
        </Card>
    );
}

export default MuiTechnologyCard;
