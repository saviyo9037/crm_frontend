import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { useQuery } from '@tanstack/react-query';
import { listleads } from '../services/leadsRouter';
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
} from 'chart.js';
import { listleadsourcesettings } from '../services/settingservices/leadSourceSettingsRouter';
import { liststaffs } from '../services/staffRouter';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function MonthlyLeadsChart({ type = 'monthly', allSources = [] }) {
    const [allLeads, setAllLeads] = useState([]);
    const [isFetchingAll, setIsFetchingAll] = useState(true);
    const [initialLoadComplete, setInitialLoadComplete] = useState(false); // Track initial load

    // Fetch the first page to get pagination metadata
    const { data: initialLeadsData, isLoading, isError, refetch } = useQuery({
        queryKey: ['Monthly leads', 1],
        queryFn: () => listleads({ page: 1 }),
    });

    // Fetch all pages of leads
    useEffect(() => {
        const fetchAllLeads = async () => {
            if (!initialLeadsData || !initialLeadsData.leads) {
                setIsFetchingAll(false); // Ensure this is set when there are no initial leads
                setInitialLoadComplete(true);
                return;
            }

            setIsFetchingAll(true);
            let allFetchedLeads = [...initialLeadsData.leads];
            const totalPages = initialLeadsData.totalPages || 1; // Adjust based on API response

            // Fetch remaining pages if there are more
            for (let page = 2; page <= totalPages; page++) {
                try {
                    const response = await listleads({ page });
                    if (response.leads && Array.isArray(response.leads)) {
                        allFetchedLeads = [...allFetchedLeads, ...response.leads];
                    }
                } catch (error) {
                    console.error(`Error fetching page ${page}:`, error);
                }
            }

            setAllLeads(allFetchedLeads);
            setIsFetchingAll(false);
            setInitialLoadComplete(true);
        };

        if (!isLoading && !isError && initialLeadsData) {
            fetchAllLeads();
        }
    }, [initialLeadsData, isLoading, isError]);

    const { data: Listsource } = useQuery({
        queryKey: ['List source'],
        queryFn: listleadsourcesettings,
    });

    const { data: Liststaff } = useQuery({
        queryKey: ['List staff'],
        queryFn: liststaffs,
    });

    const now = new Date();
    const months = [];
    for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const label = d.toLocaleString('default', { month: 'short' });
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        months.push({ label, key });
    }

    let data = {};
    let labels = [];
    let datasets = [];

    if (type === 'monthly') {
        const newLeadsCounts = {};
        const closedLeadsCounts = {};

        months.forEach(({ key }) => {
            newLeadsCounts[key] = 0;
            closedLeadsCounts[key] = 0;
        });

        allLeads.forEach((lead) => {
            const createdAt = new Date(lead.createdAt);
            const leadMonth = `${createdAt.getFullYear()}-${String(createdAt.getMonth() + 1).padStart(2, '0')}`;
            if (newLeadsCounts[leadMonth] !== undefined) {
                if (lead.status === 'new') {
                    newLeadsCounts[leadMonth] += 1;
                } else if (['closed', 'converted', 'rejected'].includes(lead.status)) {
                    closedLeadsCounts[leadMonth] += 1;
                }
            }
        });

        labels = months.map((m) => m.label);
        datasets = [
            {
                label: 'New Leads',
                data: months.map((m) => newLeadsCounts[m.key]),
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
                borderRadius: 6,
                barThickness: 20,
                maxBarThickness: 25,
                categoryPercentage: 0.5,
            },
            {
                label: 'Closed Leads',
                data: months.map((m) => closedLeadsCounts[m.key]),
                backgroundColor: 'rgba(255, 205, 86, 0.6)',
                borderColor: 'rgba(255, 205, 86, 1)',
                borderWidth: 1,
                borderRadius: 6,
                barThickness: 20,
                maxBarThickness: 25,
                categoryPercentage: 0.5,
            },
        ];
    } else if (type === 'source') {
        const sourceCounts = {};

        const validSources = Array.isArray(Listsource?.getLeadsource) ? Listsource.getLeadsource : [];

        validSources.forEach((src) => {
            if (src?.title) {
                sourceCounts[src.title] = 0;
            }
        });

        allLeads.forEach((lead) => {
            const sourceTitle = lead.source?.title;
            if (!sourceTitle || !sourceCounts.hasOwnProperty(sourceTitle)) return;

            const createdAt = new Date(lead.createdAt);
            const leadMonthKey = `${createdAt.getFullYear()}-${String(createdAt.getMonth() + 1).padStart(2, '0')}`;
            const isInLastSixMonths = months.find((m) => m.key === leadMonthKey);
            if (isInLastSixMonths) {
                sourceCounts[sourceTitle] += 1;
            }
        });

        labels = Object.keys(sourceCounts);

        const colorPalette = [
            '#4dc9f6', '#f67019', '#f53794', '#537bc4',
            '#acc236', '#166a8f', '#00a950', '#58595b',
            '#8549ba'
        ];

        datasets = [
            {
                label: 'Leads by Source',
                data: labels.map((title) => sourceCounts[title] ?? 0),
                backgroundColor: labels.map((_, i) => colorPalette[i % colorPalette.length]),
                borderRadius: 6,
                barThickness: 20,
                maxBarThickness: 25,
                categoryPercentage: 0.5,
            }
        ];
    } else if (type === 'staffs') {
        const closedStatuses = ['closed', 'converted', 'rejected'];
        const staffCounts = {};

allLeads.forEach((lead) => {
    // ✅ Handle source as object OR string safely
    let sourceTitle = "";

    if (typeof lead.source === "string") {
        sourceTitle = lead.source.trim();
    } else if (typeof lead.source === "object" && lead.source?.title) {
        sourceTitle = lead.source.title.trim();
    }

    if (!sourceTitle) return; // skip if no source

    // ✅ Make sure every source key exists before counting
    if (!sourceCounts.hasOwnProperty(sourceTitle)) {
        sourceCounts[sourceTitle] = 0;
    }

    const createdAt = new Date(lead.createdAt);
    const leadMonthKey = `${createdAt.getFullYear()}-${String(
        createdAt.getMonth() + 1
    ).padStart(2, "0")}`;
    const isInLastSixMonths = months.find((m) => m.key === leadMonthKey);

    if (isInLastSixMonths) {
        sourceCounts[sourceTitle] += 1;
    }
});


        labels = Object.keys(staffCounts);

        const colorPalette = [
            '#4dc9f6', '#f67019', '#f53794', '#537bc4',
            '#acc236', '#166a8f', '#00a950', '#58595b',
            '#8549ba', '#ff6384', '#36a2eb', '#cc65fe'
        ];

        datasets = [
            {
                label: 'Closed Leads by Staff',
                data: labels.map((name) => staffCounts[name] ?? 0),
                backgroundColor: labels.map((_, i) => colorPalette[i % colorPalette.length]),
                borderRadius: 6,
                barThickness: 20,
                maxBarThickness: 25,
                categoryPercentage: 0.5,
            }
        ];
    }

    data = { labels, datasets };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1,
                    font: { size: 12, family: "'Inter', sans-serif" },
                },
            },
            x: {
                ticks: { font: { size: 12, family: "'Inter', sans-serif" } },
            },
        },
        plugins: {
            legend: {
                display: type !== 'staffs',
                position: 'top',
                labels: {
                    font: { family: "'Inter', sans-serif", size: 13 },
                },
            },
            tooltip: {
                backgroundColor: '#1E6DB0',
                titleFont: { size: 14, family: "'Inter', sans-serif" },
                bodyFont: { size: 12, family: "'Inter', sans-serif" },
            },
        },
    };

    return (
        <div className="p-2 sm:p-3 bg-white rounded-xl w-full shadow-md">
            <h2 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-gray-800">
                {type === 'source' ? 'Lead Sources Overview'
                    : type === 'staffs' ? 'Leads Closed by Staff'
                        : 'Monthly Leads Overview'}
            </h2>
            <div
                className={`relative w-full overflow-hidden ${type === 'source' || type === 'staffs'
                    ? 'h-[420px] sm:h-[590px]'
                    : 'h-[350px] sm:h-[450px]'
                    }`}
            >
                <Bar data={data} options={options} />
            </div>
        </div>
    );
}

export default MonthlyLeadsChart;