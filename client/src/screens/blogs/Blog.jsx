import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Paginator } from "primereact/paginator";
import { Sidebar } from "primereact/sidebar";
import { useState } from "react";
import BlogCard from "../../Components/BlogCard";
import { useGetBlogsQuery } from "../../redux/apis/blogApi";
import { BLOG_TAGS } from "../../utils/blogTags";

const sortOptions = [
  { label: "Latest", value: "latest" },
  { label: "Most Popular", value: "popular" },
];

const Blog = () => {
  const { data } = useGetBlogsQuery();
  const [selectedTag, setSelectedTag] = useState(null);
  const [sortOrder, setSortOrder] = useState("latest");
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(5);
  const [visibleSidebar, setVisibleSidebar] = useState(false);

  const filteredBlogs = () => {
    let blogs = data?.data ? [...data.data] : [];

    if (selectedTag) {
      blogs = blogs.filter((blog) => blog.tags.includes(selectedTag));
    }

    if (sortOrder === "latest") {
      blogs = blogs.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    } else if (sortOrder === "popular") {
      blogs = blogs.sort((a, b) => b.likes.length - a.likes.length);
    }

    return blogs;
  };

  return (
    <div className="relative flex p-4 w-[100vw] bg-gray-50">
      <div className="flex-1">
        <div className="my-6">
          <div className="flex flex-col gap-2 w-[100vw] items-center h-full px-4">
            {filteredBlogs()?.length > 0 ? (
              filteredBlogs()
                ?.slice(first, first + rows)
                .map((blog) => <BlogCard key={blog.id} blog={blog} />)
            ) : (
              <h1 className="text-2xl text-center">No Blogs to display</h1>
            )}
          </div>
          {filteredBlogs()?.length > 5 && (
            <div className="mt-8 text-black">
              <Paginator
                className="text-black"
                first={first}
                rows={rows}
                totalRecords={filteredBlogs()?.length || 0}
                rowsPerPageOptions={[5, 10, 15, 20, 25]}
                onPageChange={(e) => {
                  setFirst(e.first);
                  setRows(e.rows);
                }}
              />
            </div>
          )}
        </div>
      </div>
      <Button
        icon="pi pi-ellipsis-v"
        className="p-button-rounded absolute right-2 top-2"
        onClick={() => setVisibleSidebar(true)}
        aria-label="Show Sidebar"
        tooltip="filters"
        tooltipOptions={{ position: "left", showDelay: 500, hideDelay: 300 }}
      />
      <Sidebar
        visible={visibleSidebar}
        onHide={() => setVisibleSidebar(false)}
        position="right"
      >
        <div className="mb-4">
          <Dropdown
            value={sortOrder}
            options={sortOptions}
            onChange={(e) => setSortOrder(e.value)}
            placeholder="Sort By"
            className="w-full bg-gray-100 text-gray-700 focus:ring-2 focus:ring-black"
          />
        </div>
        <div className="mb-4">
          <div className="text-lg font-semibold mb-2">Tags</div>
          <div className="flex flex-wrap gap-2">
            {BLOG_TAGS.map((tag) => (
              <span
                key={tag}
                className={`p-1 px-2 text-sm bg-gray-200 rounded-full cursor-pointer ${
                  selectedTag === tag ? "bg-blue-200" : ""
                }`}
                onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </Sidebar>
    </div>
  );
};

export default Blog;
