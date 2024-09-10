import { taskStatus } from "./db/enums";

export const project = {
    id: 1,
    name: 'Skala',
    percentage: 0,
    authorId: 1,
    tasks: [
        {
            id: 1,
            name: 'Конфиги',
            status: taskStatus.Done,
            priority: 'normal',
            description: 'Настроить конфиги',
            projectId: 1
        },
        {
            id: 2,
            name: 'Почесать жопу',
            status: taskStatus.InProgress,
            priority: 'normal',
            description: 'Жопа чешется',
            projectId: 1
        },
        {
            id: 3,
            name: 'Попить кофе',
            status: taskStatus.NotStarted,
            priority: 'normal',
            description: 'Люблю кофе',
            projectId: 1
        },
        {
            id: 4,
            name: 'Покурить',
            status: taskStatus.Done,
            priority: 'normal',
            projectId: 1
        },
        {
            id: 5,
            name: 'Поспать',
            status: taskStatus.Scrapped,
            priority: 'normal',
            description: 'Настроить конфиги',
            projectId: 1
        }
    ]
};