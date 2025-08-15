"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api, articleInputSchema } from "@/lib/api";
import type { Article, ArticleInput } from "@/types/article";
import type { AnimationConfig } from "@/types/animation";
import AnimatedText from "@/components/animation/AnimatedText";
import RichEditor from "@/components/article/RichEditor";

const defaultAnim: AnimationConfig = {
  globalConfig: { autoPlay: true, playSpeed: 1, previewMode: true },
  animations: [
    {
      id: "a1",
      targetType: "word",
      startIndex: 0,
      endIndex: 20,
      effect: "fadeIn",
      duration: 1000,
      delay: 0,
      easing: "easeInOut",
    },
  ],
};

interface Props {
  article?: Article | null;
  onSaved?: (a: Article) => void;
}

export default function ArticleEditor({ article, onSaved }: Props) {
  const [previewConfig, setPreviewConfig] = useState<AnimationConfig>(
    article?.animationConfig || defaultAnim
  );

  const form = useForm<ArticleInput>({
    resolver: zodResolver(articleInputSchema),
    defaultValues: {
      title: article?.title || "",
      content: article?.content || "",
      animationConfig: article?.animationConfig || defaultAnim,
      status: article?.status || "draft",
    },
  });

  const content = form.watch("content");
  const title = form.watch("title");
  const animConfig = form.watch("animationConfig") as AnimationConfig;

  useEffect(() => {
    setPreviewConfig(animConfig || defaultAnim);
  }, [animConfig]);

  const onSubmit = form.handleSubmit(async (values) => {
    const res = article
      ? await api.updateArticle(article.id, values)
      : await api.createArticle(values);
    onSaved?.(res);
  });

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-3">
        <Label>タイトル</Label>
        <Input placeholder="タイトル" {...form.register("title")} />
        <RichEditor
          value={content}
          onChange={(t) => form.setValue("content", t)}
        />

        <div className="rounded border p-3">
          <Label>アニメーション: 開始インデックス</Label>
          <Input
            type="number"
            value={animConfig?.animations?.[0]?.startIndex ?? 0}
            onChange={(e) =>
              form.setValue("animationConfig", {
                ...animConfig,
                animations: [
                  {
                    ...animConfig.animations[0],
                    startIndex: Number(e.target.value),
                  },
                ],
              })
            }
          />
          <Label className="mt-2">アニメーション: 終了インデックス</Label>
          <Input
            type="number"
            value={animConfig?.animations?.[0]?.endIndex ?? 0}
            onChange={(e) =>
              form.setValue("animationConfig", {
                ...animConfig,
                animations: [
                  {
                    ...animConfig.animations[0],
                    endIndex: Number(e.target.value),
                  },
                ],
              })
            }
          />
          <Label className="mt-2">アニメーション: 所要(ms)</Label>
          <Input
            type="number"
            value={animConfig?.animations?.[0]?.duration ?? 1000}
            onChange={(e) =>
              form.setValue("animationConfig", {
                ...animConfig,
                animations: [
                  {
                    ...animConfig.animations[0],
                    duration: Number(e.target.value),
                  },
                ],
              })
            }
          />
        </div>

        <Button onClick={onSubmit}>保存</Button>
      </div>

      <div className="rounded border p-3">
        <div className="mb-2 text-sm text-gray-500">プレビュー</div>
        <h2 className="mb-2 text-2xl font-bold">
          <AnimatedText text={title || "タイトル"} config={previewConfig} />
        </h2>
        <p className="leading-7 text-gray-700">
          <AnimatedText
            text={content || "本文プレビュー"}
            config={previewConfig}
          />
        </p>
      </div>
    </div>
  );
}
