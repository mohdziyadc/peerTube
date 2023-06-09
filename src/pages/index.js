import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import Sidebar from "@/components/Sidebar";
import VideoCard from "@/components/VideoCard";
import { useContext, useState, useEffect } from "react";
import { NotificationsContext, VideoContext } from "@/hooks/useNotifications";
import NotificationList from "@/components/NotificationsList";
import { useApolloClient, gql } from "@apollo/client";
import { useAccount } from "wagmi";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { showNotifications } = useContext(NotificationsContext);
  const { videos, setVideos } = useContext(VideoContext);
  const [thumbnailHash, setThumbnailHash] = useState("");

  const client = useApolloClient();
  const { address } = useAccount();
  const [account, setAccount] = useState();

  const QUERY = gql`
    query videos(
      $first: Int
      $skip: Int
      $orderBy: Video_orderBy
      $orderDirection: OrderDirection
      $where: Video_filter
    ) {
      videos(
        first: $first
        skip: $skip
        orderBy: $orderBy
        orderDirection: $orderDirection
        where: $where
      ) {
        id
        hash
        title
        description
        category
        thumbnailHash
        date
        author
      }
    }
  `;

  const getVideos = async () => {
    client
      .query({
        query: QUERY,
        variables: {
          first: 200,
          skip: 0,
          orderBy: "date",
          orderDirection: "desc",
        },
        fetchPolicy: "network-only",
      })
      .then(({ data }) => {
        setVideos(data.videos);
      })
      .catch((err) => {
        alert("Something went wrong. please try again.!", err.message);
      });
  };

  // const links = [];
  // async function getLinks(thumbnailHash) {
  //   const url = "https://dweb.link/api/v0";
  //   const ipfs = create({ url });

  //   for await (const link of ipfs.ls(thumbnailHash)) {
  //     links.push(link);
  //   }
  //   setThumbnailHash(links[0].name);
  //   console.log(links[0].name);
  // }
  useEffect(() => {
    // Runs the function getVideos when the component is mounted
    if (address) {
      setAccount(address);
    } else {
      setAccount(null);
    }
    getVideos();

    // console.log("Videos,", videos);
  }, [address]);

  return (
    <>
      <div className="bg-[#0F0F0F] min-w-full min-h-screen max-h-full">
        <Sidebar />
        {showNotifications && (
          <div className="absolute lg:pl-[70%] lg:pt-[5%] md:pl-[60%] md:pt-[7%] md:pr-[3%]  z-10">
            <NotificationList />
          </div>
        )}
        {account ? (
          <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 w-full h-full justify-center z-10 md:pl-[10%] md:pt-[10%] lg:pt-[7%] lg:pl-[7%]  pt-[15%] pl-[15%]">
            {videos.length != 0 ? (
              videos?.map((video) => (
                <div>
                  <VideoCard
                    id={video.id}
                    title={video.title}
                    createdAt={video.date}
                    creator={video.author}
                    thumbnailHash={video.thumbnailHash}
                    link={thumbnailHash}
                  />
                </div>
              ))
            ) : (
              <p className="text-xl font-semibold text-white text-center">
                No videos match your search
              </p>
            )}
          </div>
        ) : (
          <div className="flex w-full h-screen justify-center items-center">
            <p className="text-xl font-semibold text-white">
              Please connect your Wallet
            </p>
          </div>
        )}
      </div>
    </>
  );
}
