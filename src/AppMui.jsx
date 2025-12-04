import React, { useState, useEffect } from 'react';
import { ThemeProvider, CssBaseline, Box, Container, AppBar, Toolbar, Typography, Button, Grid, IconButton } from '@mui/material';
import { Add as AddIcon, Brightness4 as Brightness4Icon, Brightness7 as Brightness7Icon } from '@mui/icons-material';
import { theme, darkTheme } from './styles/theme';
import { useTechnologies } from './contexts/TechnologiesContext';
import { SnackbarProvider, useSnackbar } from './contexts/SnackbarContext';
import MuiDashboard from './components/MuiDashboard';
import MuiTechnologyCard from './components/MuiTechnologyCard';
import MuiTechnologyModal from './components/MuiTechnologyModal';

function AppMuiContent() {
    const { technologies, addTechnology, updateTechnology, deleteTechnology } = useTechnologies();
    const { showSnackbar } = useSnackbar();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTech, setEditingTech] = useState(null);
    const [darkMode, setDarkMode] = useState(false);

    const currentTheme = darkMode ? darkTheme : theme;

    const handleAddTechnology = (techData) => {
        const newTech = {
            id: Date.now(),
            ...techData,
            createdAt: new Date().toISOString()
        };
        addTechnology(newTech);
        showSnackbar('Технология успешно добавлена!', 'success');
    };

    const handleEditTechnology = (techData) => {
        updateTechnology(editingTech.id, techData);
        setEditingTech(null);
        showSnackbar('Технология успешно обновлена!', 'success');
    };

    const handleSaveTechnology = (techData) => {
        if (editingTech) {
            handleEditTechnology(techData);
        } else {
            handleAddTechnology(techData);
        }
    };

    const handleEdit = (technology) => {
        setEditingTech(technology);
        setIsModalOpen(true);
    };

    const handleDelete = (techId) => {
        deleteTechnology(techId);
        showSnackbar('Технология удалена', 'info');
    };

    const handleStatusChange = (techId, newStatus) => {
        updateTechnology(techId, { status: newStatus });
        const statusText = newStatus === 'completed' ? 'завершено' : newStatus === 'in-progress' ? 'в процессе' : 'не начато';
        showSnackbar(`Статус изменен на "${statusText}"`, 'success');
    };

    return (
        <ThemeProvider theme={currentTheme}>
            <CssBaseline />

            <Box sx={{ flexGrow: 1, minHeight: '100vh', backgroundColor: 'background.default' }}>
                {/* Шапка приложения */}
                <AppBar position="static" elevation={2}>
                    <Toolbar>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            🚀 Трекер изучения технологий
                        </Typography>
                        <IconButton onClick={() => setDarkMode(!darkMode)} color="inherit">
                            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
                        </IconButton>
                        <Button
                            color="inherit"
                            startIcon={<AddIcon />}
                            onClick={() => {
                                setEditingTech(null);
                                setIsModalOpen(true);
                            }}
                        >
                            Добавить технологию
                        </Button>
                    </Toolbar>
                </AppBar>

                <Container maxWidth="xl" sx={{ py: 3 }}>
                    {/* Дашборд */}
                    <MuiDashboard technologies={technologies} />

                    {/* Сетка технологий */}
                    <Box sx={{ mt: 4 }}>
                        <Typography variant="h5" gutterBottom>
                            Мои технологии ({technologies.length})
                        </Typography>

                        <Grid container spacing={3}>
                            {technologies.map(technology => (
                                <Grid item xs={12} sm={6} md={4} key={technology.id}>
                                    <MuiTechnologyCard
                                        technology={technology}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                        onStatusChange={handleStatusChange}
                                    />
                                </Grid>
                            ))}
                        </Grid>

                        {technologies.length === 0 && (
                            <Box
                                textAlign="center"
                                py={8}
                                color="text.secondary"
                            >
                                <Typography variant="h6" gutterBottom>
                                    Технологий пока нет
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    Добавьте первую технологию для отслеживания прогресса
                                </Typography>
                                <Button
                                    variant="contained"
                                    startIcon={<AddIcon />}
                                    onClick={() => setIsModalOpen(true)}
                                    sx={{ mt: 2 }}
                                >
                                    Добавить технологию
                                </Button>
                            </Box>
                        )}
                    </Box>
                </Container>

                {/* Модальное окно */}
                <MuiTechnologyModal
                    open={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setEditingTech(null);
                    }}
                    technology={editingTech}
                    onSave={handleSaveTechnology}
                />
            </Box>
        </ThemeProvider>
    );
}

function AppMui() {
    return (
        <SnackbarProvider>
            <AppMuiContent />
        </SnackbarProvider>
    );
}

export default AppMui;
