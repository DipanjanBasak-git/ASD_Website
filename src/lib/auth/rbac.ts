import prisma from "@/lib/db";
import { User, Role, RolePermission, Permission } from "@prisma/client";

export type PermissionKey =
    | "screening.read" | "screening.write" | "screening.export"
    | "therapy.read" | "therapy.write"
    | "prescription.write"
    | "patient.read" | "patient.write" | "patient.export"
    | "audit.view"
    | "consent.manage"
    | "media.upload" | "media.view";

export async function hasPermission(userId: string, permissionKey: PermissionKey): Promise<boolean> {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            role: {
                include: {
                    permissions: {
                        include: {
                            permission: true
                        }
                    }
                }
            }
        }
    });

    if (!user || !user.role) return false;

    // Admin bypass
    if (user.role.name === "ADMIN") return true;

    const permissionKeys = user.role.permissions.map(rp => rp.permission.key);
    return permissionKeys.includes(permissionKey);
}

export async function checkRole(userId: string, allowedRoles: string[]): Promise<boolean> {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { role: true }
    });

    if (!user || !user.role) return false;
    return allowedRoles.includes(user.role.name);
}
