"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { User, UserResponse } from "@/services/users/types";
import { usersApiClient } from "@/services/users/usersApi.client";
import { toast } from "react-toastify";
import UsersToolbar from "./UsersToolbar";
import UsersTable from "./UsersTable";
import Pagination from "@/components/admin/shared/Pagination";
import { useDebounce } from "use-debounce";

export default function AdminUsersPage({ initialData }: { initialData: UserResponse }) {
    const [items, setItems] = useState<User[]>(initialData.data.users);
    const [loading, setLoading] = useState(false);
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    // Filter State
    const [search, setSearch] = useState("");
    const [role, setRole] = useState("");
    const [status, setStatus] = useState("");
    const [verified, setVerified] = useState("");

    // Debounce the search term to prevent excessive API calls
    const [debouncedSearch] = useDebounce(search, 500);

    // Pagination State
    const [page, setPage] = useState(initialData.data.pagination.page);
    const [limit, setLimit] = useState(initialData.data.pagination.limit);
    const [totalPages, setTotalPages] = useState(initialData.data.pagination.totalPages);
    const [totalItems, setTotalItems] = useState(initialData.data.pagination.total);

    // Fetch Data
    const fetchData = useCallback(async (signal?: AbortSignal) => {
        setLoading(true);
        try {
            const res = await usersApiClient.list({
                page,
                limit,
                search: debouncedSearch, // Use debounced value
                role: role || undefined,
                status: status || undefined,
                verified: verified || undefined,
            }, signal);

            setItems(res.data.users);
            setTotalPages(res.data.pagination.totalPages);
            setTotalItems(res.data.pagination.total);
        } catch (error: any) {
            if (error.name !== 'CanceledError' && error.code !== "ERR_CANCELED") {
                console.error(error);
                toast.error("Failed to fetch users");
            }
        } finally {
            // We can't easily check signal.aborted here if we don't pass the controller, 
            // but the catch block handles the cancellation error.
            // A simple check is good practice to avoid setting state on unmounted component if not caught as cancel.
            if (!signal?.aborted) {
                setLoading(false);
            }
        }
    }, [page, limit, debouncedSearch, role, status, verified]);

    const isInitialMount = useRef(true);

    // Trigger fetch when dependencies change
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        const controller = new AbortController();
        fetchData(controller.signal);

        return () => controller.abort();
    }, [fetchData]);

    const handleFilterChange = (key: string, value: string) => {
        if (key === "search") setSearch(value);
        if (key === "role") setRole(value);
        if (key === "status") setStatus(value);
        if (key === "verified") setVerified(value);
        setPage(1); // Reset to page 1 on filter change
    };

    const handleClearFilters = () => {
        setSearch("");
        setRole("");
        setStatus("");
        setVerified("");
        setPage(1);
    };

    const handleToggleStatus = async (user: User) => {
        const newStatus = user.status === "active" ? "blocked" : "active";
        const oldStatus = user.status;

        if (!confirm(`Are you sure you want to ${newStatus === 'blocked' ? 'BLOCK' : 'UNBLOCK'} ${user.name}?`)) {
            return;
        }

        setUpdatingId(user._id);

        // Optimistic Update
        setItems(prev => prev.map(u =>
            u._id === user._id ? { ...u, status: newStatus } : u
        ));

        try {
            await usersApiClient.updateStatus(user._id, newStatus);
            toast.success(`User ${newStatus === 'active' ? 'unblocked' : 'blocked'}`);
        } catch (error: any) {
            // Rollback on failure
            setItems(prev => prev.map(u =>
                u._id === user._id ? { ...u, status: oldStatus } : u
            ));
            toast.error(error.response?.data?.message || "Failed to update status");
        } finally {
            setUpdatingId(null);
        }
    };

    return (
        <div className="space-y-6">
            <UsersToolbar
                filters={{ search, role, status, verified }}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
            />

            <div className={`transition-opacity ${loading ? "opacity-50 pointer-events-none" : "opacity-100"}`}>
                <UsersTable
                    items={items}
                    onToggleStatus={handleToggleStatus}
                    isUpdating={updatingId}
                />

                <div className="mt-4">
                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        totalItems={totalItems}
                        limit={limit}
                        onPageChange={setPage}
                        onLimitChange={(l) => {
                            setLimit(l);
                            setPage(1);
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
