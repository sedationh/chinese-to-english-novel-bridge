import * as fs from "fs";
import * as path from "path";
import * as iconv from "iconv-lite";

interface Chapter {
  chapterNumber: number;
  title: string;
  content: string;
}

interface ChineseBook {
  name: string;
  content: Chapter[];
}

interface EnglishBook {
  name: string;
  content: Chapter[];
}

function parseChineseBook(filePath: string): ChineseBook {
  // 读取文件内容（假设文件编码为 GBK）
  const buffer = fs.readFileSync(filePath);
  const content = iconv.decode(buffer, "gbk");

  // 获取文件名（不包含扩展名）作为书名
  const name = path.basename(filePath, path.extname(filePath));

  // 按行分割内容，过滤空行和特殊标记
  const lines = content
    .split("\n")
    .map((line: string) => line.trim())
    .filter(
      (line: string) =>
        line.length > 0 &&
        !line.startsWith("==") &&
        !line.includes("http://www.freexiaoshuo.com")
    );

  // 解析章节
  const chapters: Chapter[] = [];
  let currentChapter: Chapter | null = null;
  let currentContent: string[] = [];

  for (const line of lines) {
    // 检查是否是章节标题（格式如：第001章、第1章等）
    const chapterMatch = line.match(/^第(\d+)章/);

    if (chapterMatch) {
      // 如果已经有当前章节，保存它
      if (currentChapter) {
        currentChapter.content = currentContent.join("\n");
        chapters.push(currentChapter);
        currentContent = [];
      }

      // 创建新章节
      currentChapter = {
        chapterNumber: parseInt(chapterMatch[1]),
        title: line,
        content: "",
      };
    } else if (currentChapter) {
      // 如果不是章节标题且当前有章节，则添加到当前章节的内容中
      currentContent.push(line);
    }
  }

  // 添加最后一个章节
  if (currentChapter) {
    currentChapter.content = currentContent.join("\n");
    chapters.push(currentChapter);
  }

  return {
    name,
    content: chapters,
  };
}

// 示例使用
const chineseFilePath = path.join(
  __dirname,
  "../chinese/《超神机械师》（校对版全本）作者：齐佩甲.txt"
);
const chineseBook = parseChineseBook(chineseFilePath);

// 保存解析结果到 JSON 文件
const resultPath = path.join(__dirname, "../result.json");
fs.writeFileSync(resultPath, JSON.stringify(chineseBook, null, 2), "utf-8");

console.log("Book name:", chineseBook.name);
console.log("Total chapters:", chineseBook.content.length);
console.log("Results have been saved to result.json");
