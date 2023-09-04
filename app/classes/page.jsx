import React from "react";
import { getServerSession, } from "next-auth";
import styles from "./page.module.css";
import Link from "next/link";
import {authOptions} from '@/app/api/auth/[...nextauth]/route'
import Loader from "@/components/loader/Loader";
import Image from "next/image";


const Page = async () => {

  const session = await fetch('/api/session').then(res => res.json())
  const responses = [
        'Maths',
        'English',
        'Afrikaans',
        'History',
        'Geography',
        'Physics',
        'Life Science',
        'ISW',
        'ISO',
        'Quraanic Arabic',
        'Technology',
        'Creative Arts',
        'Coding and Robotics',
        'Life Orientation',
      ];

    const image = [
      "/maths.png",
      "/english.png",
      "/afrik.png",
      "/history.png",
      "/geog.png",
      "/physics.png",
      "/ls.png",
      "/isw.png",
      "/iso.png",
      "/qa.png",
      "/egd.png",
      "/art.png",
      "/car.png",
      "/lo.png",
    ];
  
    const responsiveImageWidths = [300, 110];
  
    return (
      <div className={styles.container}>
        <div className={styles.image}>
          <Link href={"/"}>
            <Image src={"/progress.png"} alt="" width={1920} height={1080} layout="responsive" />
          </Link>
        </div>
  
        <div className={styles.header}>
          <Image src={"/classes.png"} alt="" width={300} height={300} />
          <Image src={"/college.png"} alt="" width={110} height={110} />
          <hr color="white" />
        </div>
        <div className={styles.flexbox}>
          <div className={styles.column}>
            {responses.slice(0, Math.ceil(responses.length / 2)).map((subject, index) => (
              <div key={index} className={styles.tester}>
                <Link href={`/classes/${subject}`}>
                  <Image
                    quality={100}
                    src={image[index]}
                    alt=""
                    width={responsiveImageWidths[0]}
                    height={responsiveImageWidths[0]}
                    layout="responsive"
                  />
                </Link>
              </div>
            ))}
          </div>
          <div className={styles.column}>
            {responses.slice(Math.ceil(responses.length / 2)).map((subject, index) => (
              <div key={index} className={styles.tester}>
                <Link href={`/classes/${subject}`}>
                  <Image
                    quality={100}
                    src={image[index + 7]}
                    alt=""
                    width={responsiveImageWidths[1]}
                    height={responsiveImageWidths[1]}
                    layout="responsive"
                  />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };


export default Page;