interface IDefaultsData {
    from: {
        name: string;
        email: string;
    };
}

interface IMailConfig {
    driver: 'ses' | 'ethereal';
    defaults: IDefaultsData;
}

export default {
    driver: process.env.MAIL_DRIVER || 'ethereal',
    defaults: {
        from: {
            name: 'Equipe GoBarber',
            email: 'equipe@gobarber.com',
        },
    },
} as IMailConfig;
