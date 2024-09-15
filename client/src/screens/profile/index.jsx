import { useGetRandomUserProfileQuery } from "../../redux/apis/authApi";
import { Card } from "primereact/card";
import { TabView, TabPanel } from "primereact/tabview";
import UserAvatar from "../../Components/Avatar";
import BlogCard from "../../Components/BlogCard";
import { useParams } from "react-router-dom";

const Profile = () => {
  const { id } = useParams();

  const { data } = useGetRandomUserProfileQuery(id);
  const blogs = data?.data?.blogs;
  const user = data?.data?.user;
  return (
    <div className="max-w-4xl mx-auto">
      <Card className="mt-12 shadow-md max-h-[70vh] overflow-y-scroll">
        <h1 className="text-3xl ml-4 font-bold mb-3">{user?.name}</h1>
        <TabView>
          <TabPanel header="Overview">
            <div className="flex flex-col items-center md:flex-row md:items-start md:space-x-6 space-y-6 md:space-y-0">
              <div className="flex-shrink-0 bg flex gap-8 justify-center items-center md:justify-start w-full md:w-auto">
                <div className="w-[120px] h-[120px] md:w-[150px] md:h-[150px] rounded-full overflow-hidden flex items-center justify-center bg-gray-200 shadow-md">
                  <UserAvatar
                    image={user?.avatar?.url}
                    name={user?.name}
                    avatarSize="w-full h-full"
                    spanSize="text-6xl"
                  />
                </div>
              </div>
              <div className="text-center md:text-left w-full">
                <p className="text-gray-600 mb-4">{user?.bio}</p>
                <p className="text-gray-600 mb-4">
                  <strong>Date Joined:</strong>{" "}
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "N/A"}
                </p>

                <div className="flex justify-center md:justify-start space-x-4">
                  {user?.creatorInfo?.social?.twitter && (
                    <a
                      href={`https://twitter.com/${user.creatorInfo.social.twitter}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-500"
                    >
                      <i
                        className="pi pi-twitter"
                        style={{ fontSize: "1.2rem" }}
                      />
                    </a>
                  )}
                  {user?.creatorInfo?.social?.github && (
                    <a
                      href={`https://github.com/${user.creatorInfo.social.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-800 hover:text-gray-900"
                    >
                      <i
                        className="pi pi-github"
                        style={{ fontSize: "1.2rem" }}
                      />
                    </a>
                  )}
                  {user?.creatorInfo?.social?.linkedin && (
                    <a
                      href={`https://www.linkedin.com/in/${user.creatorInfo.social.linkedin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-700 hover:text-blue-800"
                    >
                      <i
                        className="pi pi-linkedin"
                        style={{ fontSize: "1.2rem" }}
                      />
                    </a>
                  )}
                  {user?.creatorInfo?.social?.instagram && (
                    <a
                      href={`https://www.instagram.com/${user.creatorInfo.social.instagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-pink-600 hover:text-pink-700"
                    >
                      <i
                        className="pi pi-instagram"
                        style={{ fontSize: "1.2rem" }}
                      />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </TabPanel>

          {/* Blogs Tab */}
          <TabPanel header="Blogs">
            <div className="p-4">
              {blogs?.map((blog, i) => (
                <BlogCard blog={blog} key={i} />
              ))}
            </div>
          </TabPanel>
        </TabView>
      </Card>
    </div>
  );
};

export default Profile;
