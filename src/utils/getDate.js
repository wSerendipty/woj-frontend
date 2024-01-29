export function getNextWeek() {
// 获取当前日期
    const currentDate = new Date();

// 初始化一个数组来存储结果
    const datesInNextWeek = [];

// 遍历接下来的7天
    for (let i = 0; i < 7; i++) {
        // 创建新的日期对象，增加一天
        const nextDay = new Date(currentDate);
        nextDay.setDate(currentDate.getDate() + i);

        // 提取月份（JavaScript中月份是从0开始的，所以需要加1）
        const month = nextDay.getMonth() + 1;
        // 提取日期
        const date = nextDay.getDate();
        // 提取星期，0表示周日，1表示周一，依次类推
        const dayOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][nextDay.getDay()];

        // 将月份、日期和星期存入数组
        datesInNextWeek.push({month: month, date: date, dayOfWeek: dayOfWeek});
    }

    return datesInNextWeek;
}

export function groupDatesByMonthAndWeek() {
    // 获取当前日期
    const currentDate = new Date();

    // 创建一个空数组用于存储分组后的日期
    const groupedDates = [];

    // 循环获取当前月及前三个月的日期
    for (let monthOffset = 3; monthOffset >= 0; monthOffset--) {
        // 设置目标月份的日期为每月的第一天
        const targetDate = new Date(currentDate);
        targetDate.setMonth(currentDate.getMonth() - monthOffset, 1);

        // 获取目标月份的天数
        const daysInMonth = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0).getDate();

        // 循环获取目标月份的每一天
        const monthDates = [];
        for (let day = 1; day <= daysInMonth; day++) {
            targetDate.setDate(day);
            const dateString = `${targetDate.getFullYear()}-${(targetDate.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            monthDates.push(dateString);
        }

        // 将月份按每7天分组
        const weeks = [];
        for (let i = 0; i < monthDates.length; i += 7) {
            weeks.push(monthDates.slice(i, i + 7));
        }

        // 将月份及其内的每7天分组添加到结果数组
        groupedDates.push({
            month: `${(targetDate.getMonth() + 1).toString()}`,
            weeks,
        });
    }

    return groupedDates;
}

export function getMonths() {
    // 获取当前日期
    const currentDate = new Date();

    // 获取当前月份
    const currentMonth = currentDate.getMonth() + 1; // 月份是从0开始计数的，所以要加1

    // 获取前三个月份
    const months = [];
    for (let i = 0; i < 4; i++) {
        let targetMonth = currentDate.getMonth() - i;
        let targetYear = currentDate.getFullYear();

        // 处理跨年份
        if (targetMonth < 0) {
            targetMonth += 12;
            targetYear--;
        }

        // 添加到数组
        months.unshift({
            year: targetYear,
            month: targetMonth + 1, // 月份是从0开始计数的，所以要加1
        });
    }

    return months;
}


