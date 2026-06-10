"use client";

import type { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { SupportMenuNode } from "@/lib/api/support-api";

export type CategoryDialogMode = "create" | "edit";

export type CategoryDialogValues = {
  title: string;
  slug: string;
  description: string;
};

type CategoryDialogProps = {
  category?: SupportMenuNode | null;
  mode: CategoryDialogMode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: CategoryDialogValues) => void;
};

export function CategoryDialog({ category, mode, open, onOpenChange, onSubmit }: CategoryDialogProps) {
  const isEdit = mode === "edit";

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const values = {
      title: String(formData.get("title") ?? "").trim(),
      slug: String(formData.get("slug") ?? "").trim(),
      description: String(formData.get("description") ?? "").trim()
    };

    if (!values.title || !values.slug) return;
    onSubmit(values);
    event.currentTarget.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form className="grid gap-5" onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEdit ? "カテゴリを編集" : "新しいカテゴリを追加"}</DialogTitle>
            <DialogDescription>
              {isEdit
                ? "カテゴリ名を編集します。Slug はモックデータの整合性を保つため読み取り専用です。"
                : "カテゴリ情報を入力して、マニュアルの目次に新しいカテゴリを追加します。"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor={`${mode}-category-title`}>カテゴリ名</Label>
              <Input id={`${mode}-category-title`} name="title" defaultValue={category?.title ?? ""} placeholder="例: 点検データの管理" required />
            </div>

            <div className="grid gap-2">
              <Label htmlFor={`${mode}-category-slug`}>Slug</Label>
              <Input
                id={`${mode}-category-slug`}
                name="slug"
                defaultValue={category?.categorySlug ?? ""}
                placeholder="inspection-data-guide"
                readOnly={isEdit}
                required
              />
            </div>

            {!isEdit ? (
              <div className="grid gap-2">
                <Label htmlFor={`${mode}-category-description`}>説明</Label>
                <Input id={`${mode}-category-description`} name="description" placeholder="カテゴリの概要を入力" />
              </div>
            ) : null}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                キャンセル
              </Button>
            </DialogClose>
            <Button type="submit">{isEdit ? "保存" : "追加"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
