import React from 'react';
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    LinearProgress,
    Chip,
    Paper,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Divider,
    AppBar,
    Toolbar,
    Tabs,
    Tab
} from '@mui/material';
import {
    CheckCircle as CheckCircleIcon,
    Schedule as ScheduleIcon,
    RadioButtonUnchecked as RadioButtonUncheckedIcon
} from '@mui/icons-material';

function TabPanel({ children, value, index, ...other }) {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`dashboard-tabpanel-${index}`}
            aria-labelledby={`dashboard-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

function MuiDashboard({ technologies }) {
    const [tabValue, setTabValue] = React.useState(0);

    // Статистика
    const stats = {
        total: technologies.length,
        completed: technologies.filter(t => t.status === 'completed').length,
        inProgress: technologies.filter(t => t.status === 'in-progress').length,
        notStarted: technologies.filter(t => t.status === 'not-started').length,
        progress: technologies.length > 0 ?
            Math.round((technologies.filter(t => t.status === 'completed').length / technologies.length) * 100) : 0
    };

    // Недавно добавленные
    const recentTechnologies = technologies
        .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        .slice(0, 5);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            {/* Шапка */}
            <AppBar position="static" color="default" elevation={1}>
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Панель управления
                    </Typography>
                </Toolbar>
            </AppBar>

            {/* Табы */}
            <Paper sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="dashboard tabs">
                    <Tab label="Обзор" />
                    <Tab label="Статистика" />
                    <Tab label="Активность" />
                </Tabs>
            </Paper>

            {/* Вкладка обзора */}
            <TabPanel value={tabValue} index={0}>
                <Grid container spacing={3}>
                    {/* Статистические карточки */}
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Typography color="text.secondary" gutterBottom>
                                    Всего технологий
                                </Typography>
                                <Typography variant="h4" component="div">
                                    {stats.total}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Typography color="text.secondary" gutterBottom>
                                    Завершено
                                </Typography>
                                <Typography variant="h4" component="div" color="success.main">
                                    {stats.completed}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Typography color="text.secondary" gutterBottom>
                                    В процессе
                                </Typography>
                                <Typography variant="h4" component="div" color="warning.main">
                                    {stats.inProgress}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Typography color="text.secondary" gutterBottom>
                                    Не начато
                                </Typography>
                                <Typography variant="h4" component="div" color="text.secondary">
                                    {stats.notStarted}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Прогресс */}
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Общий прогресс
                                </Typography>
                                <Box display="flex" alignItems="center" gap={2}>
                                    <Box flex={1}>
                                        <LinearProgress
                                            variant="determinate"
                                            value={stats.progress}
                                            sx={{ height: 10, borderRadius: 5 }}
                                        />
                                    </Box>
                                    <Typography variant="h6" color="primary">
                                        {stats.progress}%
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Активные технологии */}
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Активные технологии
                                </Typography>
                                <List>
                                    {technologies.filter(t => t.status === 'in-progress').map((tech, index) => (
                                        <React.Fragment key={tech.id}>
                                            <ListItem>
                                                <ListItemIcon>
                                                    <ScheduleIcon color="warning" />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={tech.title}
                                                    secondary={tech.description}
                                                />
                                                <Chip
                                                    label="В процессе"
                                                    size="small"
                                                    color="warning"
                                                />
                                            </ListItem>
                                            {index < technologies.filter(t => t.status === 'in-progress').length - 1 && <Divider />}
                                        </React.Fragment>
                                    ))}

                                    {technologies.filter(t => t.status === 'in-progress').length === 0 && (
                                        <ListItem>
                                            <ListItemText
                                                primary="Нет активных технологий"
                                                secondary="Начните изучение новой технологии"
                                            />
                                        </ListItem>
                                    )}
                                </List>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Недавно добавленные */}
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Недавно добавленные
                                </Typography>
                                <List>
                                    {recentTechnologies.map((tech, index) => (
                                        <React.Fragment key={tech.id}>
                                            <ListItem>
                                                <ListItemIcon>
                                                    {tech.status === 'completed' ? (
                                                        <CheckCircleIcon color="success" />
                                                    ) : tech.status === 'in-progress' ? (
                                                        <ScheduleIcon color="warning" />
                                                    ) : (
                                                        <RadioButtonUncheckedIcon color="disabled" />
                                                    )}
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={tech.title}
                                                    secondary={tech.description}
                                                />
                                                <Chip
                                                    label={tech.status === 'completed' ? 'Завершено' :
                                                        tech.status === 'in-progress' ? 'В процессе' : 'Не начато'}
                                                    size="small"
                                                    variant="outlined"
                                                />
                                            </ListItem>
                                            {index < recentTechnologies.length - 1 && <Divider />}
                                        </React.Fragment>
                                    ))}
                                </List>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </TabPanel>

            {/* Вкладка статистики */}
            <TabPanel value={tabValue} index={1}>
                <Typography variant="h4" gutterBottom>
                    Детальная статистика
                </Typography>

                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Распределение по статусам
                                </Typography>
                                <Box sx={{ mt: 2 }}>
                                    <Box display="flex" justifyContent="space-between" mb={1}>
                                        <Typography>Завершено</Typography>
                                        <Typography>{stats.completed} ({stats.progress}%)</Typography>
                                    </Box>
                                    <LinearProgress variant="determinate" value={stats.progress} color="success" />

                                    <Box display="flex" justifyContent="space-between" mt={2} mb={1}>
                                        <Typography>В процессе</Typography>
                                        <Typography>{stats.inProgress}</Typography>
                                    </Box>
                                    <LinearProgress
                                        variant="determinate"
                                        value={(stats.inProgress / stats.total) * 100}
                                        color="warning"
                                    />

                                    <Box display="flex" justifyContent="space-between" mt={2} mb={1}>
                                        <Typography>Не начато</Typography>
                                        <Typography>{stats.notStarted}</Typography>
                                    </Box>
                                    <LinearProgress
                                        variant="determinate"
                                        value={(stats.notStarted / stats.total) * 100}
                                        color="inherit"
                                    />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </TabPanel>

            {/* Вкладка активности */}
            <TabPanel value={tabValue} index={2}>
                <Typography variant="h4" gutterBottom>
                    История активности
                </Typography>
                <Typography color="text.secondary">
                    Здесь будет отображаться история изменений статусов...
                </Typography>
            </TabPanel>
        </Box>
    );
}

export default MuiDashboard;
