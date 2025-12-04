import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    MenuItem
} from '@mui/material';

function MuiTechnologyModal({ open, onClose, technology, onSave }) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'not-started'
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (technology) {
            setFormData({
                title: technology.title || '',
                description: technology.description || '',
                status: technology.status || 'not-started'
            });
        } else {
            setFormData({
                title: '',
                description: '',
                status: 'not-started'
            });
        }
        setErrors({});
    }, [technology, open]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Название технологии обязательно';
        } else if (formData.title.trim().length < 2) {
            newErrors.title = 'Название должно содержать минимум 2 символа';
        } else if (formData.title.trim().length > 50) {
            newErrors.title = 'Название не должно превышать 50 символов';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Описание технологии обязательно';
        } else if (formData.description.trim().length < 10) {
            newErrors.description = 'Описание должно содержать минимум 10 символов';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = () => {
        if (validateForm()) {
            onSave(formData);
            onClose();
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                {technology ? 'Редактирование технологии' : 'Добавление новой технологии'}
            </DialogTitle>

            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    name="title"
                    label="Название технологии"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={formData.title}
                    onChange={handleChange}
                    error={!!errors.title}
                    helperText={errors.title}
                    placeholder="Например: React, Node.js, TypeScript"
                    required
                />

                <TextField
                    margin="dense"
                    name="description"
                    label="Описание"
                    type="text"
                    fullWidth
                    variant="outlined"
                    multiline
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    error={!!errors.description}
                    helperText={errors.description}
                    placeholder="Опишите, что это за технология и зачем её изучать..."
                    required
                />

                <TextField
                    margin="dense"
                    name="status"
                    label="Статус изучения"
                    select
                    fullWidth
                    variant="outlined"
                    value={formData.status}
                    onChange={handleChange}
                >
                    <MenuItem value="not-started">Не начато</MenuItem>
                    <MenuItem value="in-progress">В процессе</MenuItem>
                    <MenuItem value="completed">Завершено</MenuItem>
                </TextField>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>
                    Отмена
                </Button>
                <Button onClick={handleSubmit} variant="contained">
                    {technology ? 'Обновить' : 'Добавить'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default MuiTechnologyModal;
