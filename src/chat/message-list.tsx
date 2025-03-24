import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Message } from "./message";


export const MessageList = () => {
  const [scrollRef, inView, entry] = useInView({
    trackVisibility: true,
    delay: 1000,
  });

  const loading = false;
  const error = null;
  const data = {
    messageCollection: {
      edges: [
        {
          node: {
            id: "1",
            username: "JohnDoe",
            avatar: "https://img.freepik.com/premium-vector/man-avatar-profile-picture-isolated-background-avatar-profile-picture-man_1293239-4841.jpg?semt=ais_hybrid",
            body: "Hello, world!",
            likes: 5,
            createdAt: "2023-01-01T12:00:00Z",
          },
        },
        {
          node: {
            id: "2",
            username: "JaneDoe",
            avatar: "https://t4.ftcdn.net/jpg/02/79/66/93/360_F_279669366_Lk12QalYQKMczLEa4ySjhaLtx1M2u7e6.jpg",
            body: "Hi there!",
            likes: 3,
            createdAt: "2023-01-01T12:05:00Z",
          },
        },
      ],
    },
  };

  useEffect(() => {
    if (entry?.target) {
      entry.target.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [data?.messageCollection.edges.length, entry?.target]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-white">Fetching most recent chat messages.</p>
      </div>
    );

  if (error)
    return (
      <p className="text-white">Something went wrong. Refresh to try again.</p>
    );

  return (
    <div className="flex flex-col w-full space-y-3 overflow-y-scroll no-scrollbar">
      {!inView && data?.messageCollection.edges.length && (
        <div className="py-1.5 w-full px-3 z-10 text-xs absolute flex justify-center bottom-0 mb-[120px] inset-x-0">
          <button
            className="py-1.5 px-3 text-xs bg-[#1c1c1f] border border-[#363739] rounded-full text-white font-medium"
            onClick={() => {
              entry?.target.scrollIntoView({ behavior: "smooth", block: "end" })
            }}
          >
            Scroll to see latest messages
          </button>
        </div>
      )}
      {data?.messageCollection?.edges?.map(({ node }) => (
        <Message key={node?.id} message={node} />
      ))}
      <div ref={scrollRef} />
    </div>
  );
};
