import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

const medium = fetch(
  new URL('../../assets/DMSans-Medium.ttf', import.meta.url)
).then((res) => res.arrayBuffer());

const bold = fetch(
  new URL('../../assets/DMSans-Bold.ttf', import.meta.url)
).then((res) => res.arrayBuffer());

const mono = fetch(
  new URL('../../assets/JetBrainsMono-SemiBold.ttf', import.meta.url)
).then((res) => res.arrayBuffer());


// Edge config
export const config = {
  runtime: 'edge',
};

export default async function GET(request: NextRequest) {
  const mediumData = await medium;
  const boldData = await bold;
  const monoData = await mono;

  const { searchParams } = new URL(request.url);

  // ?title=<title>
  const hasTitle = searchParams.has('title');
  const title = hasTitle
    ? searchParams.get('title').replace('/CodeBoard', '')
    : 'OG Generator';

  const hasDesc = searchParams.has('desc');
  const desc = hasDesc
    ? searchParams.get('desc')
    : 'This api route makes dynamic image for embed in other apps. This is used for board displays. like github does';

  const hasKey = searchParams.has('key');
  const key = hasKey ? searchParams.get('key') : 'A1b2C3';

  return new ImageResponse(
    (
      <div
        style={{
          borderRadius: '42px',
          backgroundImage: 'linear-gradient(135deg, #212428 0%, #17191B 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          padding: '24px',
        }}>
        <h1
          style={{
            margin: '0',
            color: '#CAD4E2',
            maxWidth: 975,
            fontSize: 64,
            fontFamily: '"DM Sans Bold"',
            position: 'absolute',
            top: 80,
            left: 80,
          }}>
          {' '}
          {title}{' '}
        </h1>
        <h2
          style={{
            margin: '0',
            color: '#81878F',
            maxWidth: 750,
            fontSize: 32,
            fontFamily: '"DM Sans"',
            position: 'absolute',
            top: 190,
            left: 80,
          }}>
          {desc}
        </h2>
        <h3
          style={{
            color: '#81878F',
            fontSize: 28,
            padding: '14px 28px',
            background: 'rgba(0, 0, 0, 0.42)',
            position: 'absolute',
            fontFamily: '"JetBrains Mono"',
            top: 340,
            left: 80,
            borderRadius: '50px',
          }}>
          /bin/{key}
        </h3>

        <div
          style={{
            width: '90%',
            position: 'absolute',
            padding: 2,
            background: '#8D40BC',
            top: 470,
            left: 80,
            borderRadius: '20px',
          }}></div>

        <div
          style={{
            position: 'absolute',
            display: 'flex',
            padding: '40px 80px',
            top: 470,
            alignItems: 'center',
            justifyItems: 'space-between',
          }}>
          <h3
            style={{
              color: '#81878F',
              fontSize: 36,
              fontFamily: '"DM Sans Bold"',
            }}>
            board.is-an.app
          </h3>
          <svg
            style={{ position: 'absolute', left: 770 }}
            width="338"
            height="57"
            viewBox="0 0 338 57"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M7.19885 8.26377C11.8082 2.97257 18.0598 2.84941e-07 24.5784 0V4.7025H23.0693H22.8333C21.5347 4.7025 20.4821 5.75517 20.4821 7.05369C20.4821 8.35222 21.5347 9.40489 22.8333 9.40489H24.5784V14.107H16.6887C15.3902 14.107 14.3376 15.1597 14.3376 16.4582C14.3376 17.7568 15.3902 18.8094 16.6887 18.8094H24.5784V28.2143V31.7413H22.8333C21.5347 31.7413 20.4821 32.794 20.4821 34.0925C20.4821 35.391 21.5347 36.4437 22.8333 36.4437H24.5784L24.5784 56.4286C18.0598 56.4286 11.8082 53.456 7.19885 48.1648C2.5895 42.8736 0 35.6972 0 28.2143C0 20.7314 2.5895 13.555 7.19885 8.26377Z"
              fill="#692D8E"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M27.6508 0C21.1322 0 14.8806 2.97257 10.2712 8.26377C5.66186 13.555 3.07236 20.7314 3.07236 28.2143C3.07236 35.6972 5.66186 42.8736 10.2712 48.1648C14.8806 53.456 21.1322 56.4286 27.6508 56.4286V44.2622C27.0325 43.8386 26.6268 43.1273 26.6268 42.3212C26.6268 41.5151 27.0325 40.8037 27.6508 40.3801V36.4436H22.8333C21.5347 36.4436 20.4821 35.3909 20.4821 34.0924C20.4821 32.7939 21.5347 31.7412 22.8333 31.7412H27.6508V28.2143V26.6284C27.0325 26.2048 26.6268 25.4935 26.6268 24.6874C26.6268 23.8813 27.0325 23.1699 27.6508 22.7463V18.8093H16.6887C15.3902 18.8093 14.3376 17.7566 14.3376 16.4581C14.3376 15.1596 15.3902 14.1069 16.6887 14.1069H27.6508V9.40477H22.8333C21.5347 9.40477 20.4821 8.35211 20.4821 7.05358C20.4821 5.75506 21.5347 4.70239 22.8333 4.70239H23.0693H27.6508V0ZM27.6508 9.40477H28.6749H34.5165C35.815 9.40477 36.8677 8.35211 36.8677 7.05358C36.8677 5.75506 35.815 4.70239 34.5165 4.70239H27.6508V0.00012207H39.0124C41.2215 0.00012207 43.0124 1.79098 43.0124 4.00012V22.3362H28.978C28.4856 22.3362 28.0285 22.4875 27.6508 22.7463V18.8093H38.613C39.9115 18.8093 40.9642 17.7566 40.9642 16.4581C40.9642 15.1596 39.9115 14.1069 38.613 14.1069H27.6508V9.40477ZM27.6508 26.6285V31.7412H37.5888C38.8873 31.7412 39.94 32.7939 39.94 34.0924C39.94 35.3909 38.8873 36.4436 37.5888 36.4436H27.6508V40.3801C28.0285 40.1213 28.4856 39.97 28.978 39.97H38.613C39.9115 39.97 40.9642 41.0226 40.9642 42.3212C40.9642 43.6197 39.9116 44.6724 38.613 44.6724H28.978C28.4856 44.6724 28.0285 44.521 27.6508 44.2623V56.4287H39.0124C41.0615 56.4287 42.7508 54.8879 42.9847 52.9016H35.1225C33.824 52.9016 32.7713 51.8489 32.7713 50.5504C32.7713 49.2519 33.824 48.1992 35.1225 48.1992H43.0124V27.0386H28.978C28.4856 27.0386 28.0285 26.8872 27.6508 26.6285Z"
              fill="#8D40BC"
            />
            <path
              d="M86.025 46.48C83.849 46.48 81.945 46.08 80.313 45.28C78.713 44.448 77.465 43.264 76.569 41.728C75.705 40.16 75.273 38.336 75.273 36.256V20.704C75.273 18.592 75.705 16.768 76.569 15.232C77.465 13.696 78.713 12.528 80.313 11.728C81.945 10.896 83.849 10.48 86.025 10.48C88.201 10.48 90.089 10.896 91.689 11.728C93.289 12.56 94.521 13.744 95.385 15.28C96.281 16.784 96.729 18.592 96.729 20.704H91.545C91.545 18.88 91.065 17.488 90.105 16.528C89.145 15.568 87.785 15.088 86.025 15.088C84.265 15.088 82.889 15.568 81.897 16.528C80.937 17.488 80.457 18.864 80.457 20.656V36.256C80.457 38.048 80.937 39.44 81.897 40.432C82.889 41.392 84.265 41.872 86.025 41.872C87.785 41.872 89.145 41.392 90.105 40.432C91.065 39.44 91.545 38.048 91.545 36.256H96.729C96.729 38.336 96.281 40.144 95.385 41.68C94.521 43.216 93.289 44.4 91.689 45.232C90.089 46.064 88.201 46.48 86.025 46.48ZM114.614 46.432C112.438 46.432 110.55 46.016 108.95 45.184C107.35 44.352 106.118 43.168 105.254 41.632C104.39 40.096 103.958 38.288 103.958 36.208V29.392C103.958 27.28 104.39 25.472 105.254 23.968C106.118 22.432 107.35 21.248 108.95 20.416C110.55 19.584 112.438 19.168 114.614 19.168C116.79 19.168 118.678 19.584 120.278 20.416C121.878 21.248 123.11 22.432 123.974 23.968C124.838 25.472 125.27 27.28 125.27 29.392V36.208C125.27 38.288 124.838 40.096 123.974 41.632C123.11 43.168 121.878 44.352 120.278 45.184C118.678 46.016 116.79 46.432 114.614 46.432ZM114.614 41.872C116.374 41.872 117.734 41.392 118.694 40.432C119.654 39.44 120.134 38.032 120.134 36.208V29.392C120.134 27.536 119.654 26.128 118.694 25.168C117.734 24.208 116.374 23.728 114.614 23.728C112.886 23.728 111.526 24.208 110.534 25.168C109.574 26.128 109.094 27.536 109.094 29.392V36.208C109.094 38.032 109.574 39.44 110.534 40.432C111.526 41.392 112.886 41.872 114.614 41.872ZM141.523 46.48C138.867 46.48 136.739 45.584 135.139 43.792C133.539 42 132.739 39.584 132.739 36.544V29.104C132.739 26.032 133.539 23.6 135.139 21.808C136.739 20.016 138.867 19.12 141.523 19.12C143.699 19.12 145.427 19.728 146.707 20.944C147.987 22.128 148.627 23.76 148.627 25.84L147.523 24.64H148.723L148.579 18.496V10.96H153.763V46H148.627V40.96H147.523L148.627 39.76C148.627 41.84 147.987 43.488 146.707 44.704C145.427 45.888 143.699 46.48 141.523 46.48ZM143.299 41.968C144.931 41.968 146.211 41.472 147.139 40.48C148.099 39.456 148.579 38.048 148.579 36.256V29.344C148.579 27.552 148.099 26.16 147.139 25.168C146.211 24.144 144.931 23.632 143.299 23.632C141.603 23.632 140.275 24.128 139.315 25.12C138.355 26.08 137.875 27.488 137.875 29.344V36.256C137.875 38.112 138.355 39.536 139.315 40.528C140.275 41.488 141.603 41.968 143.299 41.968ZM172.177 46.48C170.033 46.48 168.145 46.064 166.513 45.232C164.913 44.368 163.681 43.168 162.817 41.632C161.953 40.096 161.521 38.304 161.521 36.256V29.344C161.521 27.264 161.953 25.472 162.817 23.968C163.681 22.432 164.913 21.248 166.513 20.416C168.145 19.552 170.033 19.12 172.177 19.12C174.353 19.12 176.241 19.552 177.841 20.416C179.441 21.248 180.673 22.432 181.537 23.968C182.401 25.472 182.833 27.264 182.833 29.344V34.048H166.513V36.256C166.513 38.208 166.993 39.696 167.953 40.72C168.945 41.744 170.369 42.256 172.225 42.256C173.729 42.256 174.945 42 175.873 41.488C176.801 40.944 177.377 40.16 177.601 39.136H182.737C182.353 41.376 181.201 43.168 179.281 44.512C177.361 45.824 174.993 46.48 172.177 46.48ZM177.841 30.928V29.296C177.841 27.376 177.361 25.888 176.401 24.832C175.441 23.776 174.033 23.248 172.177 23.248C170.353 23.248 168.945 23.776 167.953 24.832C166.993 25.888 166.513 27.392 166.513 29.344V30.544L178.225 30.496L177.841 30.928ZM190.638 46V10.96H200.958C204.286 10.96 206.894 11.76 208.782 13.36C210.67 14.96 211.614 17.168 211.614 19.984C211.614 21.584 211.262 22.976 210.558 24.16C209.886 25.312 208.942 26.208 207.726 26.848C206.51 27.488 205.086 27.808 203.454 27.808V27.328C205.214 27.296 206.766 27.632 208.11 28.336C209.454 29.008 210.51 30.016 211.278 31.36C212.046 32.704 212.43 34.304 212.43 36.16C212.43 38.144 211.982 39.888 211.086 41.392C210.222 42.864 208.974 44 207.342 44.8C205.742 45.6 203.838 46 201.63 46H190.638ZM195.678 41.536H201.198C203.054 41.536 204.526 41.04 205.614 40.048C206.702 39.056 207.246 37.68 207.246 35.92C207.246 34.128 206.702 32.688 205.614 31.6C204.526 30.512 203.054 29.968 201.198 29.968H195.678V41.536ZM195.678 25.648H200.91C202.638 25.648 203.998 25.184 204.99 24.256C205.982 23.328 206.478 22.08 206.478 20.512C206.478 18.944 205.982 17.712 204.99 16.816C203.998 15.888 202.654 15.424 200.958 15.424H195.678V25.648ZM229.739 46.432C227.563 46.432 225.675 46.016 224.075 45.184C222.475 44.352 221.243 43.168 220.379 41.632C219.515 40.096 219.083 38.288 219.083 36.208V29.392C219.083 27.28 219.515 25.472 220.379 23.968C221.243 22.432 222.475 21.248 224.075 20.416C225.675 19.584 227.563 19.168 229.739 19.168C231.915 19.168 233.803 19.584 235.403 20.416C237.003 21.248 238.235 22.432 239.099 23.968C239.963 25.472 240.395 27.28 240.395 29.392V36.208C240.395 38.288 239.963 40.096 239.099 41.632C238.235 43.168 237.003 44.352 235.403 45.184C233.803 46.016 231.915 46.432 229.739 46.432ZM229.739 41.872C231.499 41.872 232.859 41.392 233.819 40.432C234.779 39.44 235.259 38.032 235.259 36.208V29.392C235.259 27.536 234.779 26.128 233.819 25.168C232.859 24.208 231.499 23.728 229.739 23.728C228.011 23.728 226.651 24.208 225.659 25.168C224.699 26.128 224.219 27.536 224.219 29.392V36.208C224.219 38.032 224.699 39.44 225.659 40.432C226.651 41.392 228.011 41.872 229.739 41.872ZM255.88 46.48C253.128 46.48 250.952 45.776 249.352 44.368C247.784 42.928 247 40.976 247 38.512C247 36.016 247.832 34.064 249.496 32.656C251.192 31.216 253.512 30.496 256.456 30.496H263.8V28.048C263.8 26.608 263.352 25.488 262.456 24.688C261.56 23.888 260.296 23.488 258.664 23.488C257.224 23.488 256.024 23.808 255.064 24.448C254.104 25.056 253.544 25.872 253.384 26.896H248.296C248.584 24.528 249.672 22.64 251.56 21.232C253.48 19.824 255.896 19.12 258.808 19.12C261.944 19.12 264.424 19.92 266.248 21.52C268.072 23.088 268.984 25.232 268.984 27.952V46H263.944V41.152H263.08L263.944 40.192C263.944 42.112 263.208 43.648 261.736 44.8C260.264 45.92 258.312 46.48 255.88 46.48ZM257.416 42.496C259.272 42.496 260.792 42.032 261.976 41.104C263.192 40.144 263.8 38.928 263.8 37.456V34H256.552C255.208 34 254.136 34.368 253.336 35.104C252.568 35.84 252.184 36.848 252.184 38.128C252.184 39.472 252.648 40.544 253.576 41.344C254.504 42.112 255.784 42.496 257.416 42.496ZM277.798 46V19.6H282.79V24.64H284.038L282.454 27.76C282.454 24.912 283.078 22.768 284.326 21.328C285.574 19.856 287.43 19.12 289.894 19.12C292.71 19.12 294.934 20 296.566 21.76C298.23 23.488 299.062 25.872 299.062 28.912V30.688H293.734V29.344C293.734 27.456 293.254 26.016 292.294 25.024C291.366 24 290.054 23.488 288.358 23.488C286.662 23.488 285.334 24 284.374 25.024C283.446 26.048 282.982 27.488 282.982 29.344V46H277.798ZM314.211 46.48C311.555 46.48 309.427 45.584 307.827 43.792C306.227 42 305.427 39.584 305.427 36.544V29.104C305.427 26.032 306.227 23.6 307.827 21.808C309.427 20.016 311.555 19.12 314.211 19.12C316.387 19.12 318.115 19.728 319.395 20.944C320.675 22.128 321.315 23.76 321.315 25.84L320.211 24.64H321.411L321.267 18.496V10.96H326.451V46H321.315V40.96H320.211L321.315 39.76C321.315 41.84 320.675 43.488 319.395 44.704C318.115 45.888 316.387 46.48 314.211 46.48ZM315.987 41.968C317.619 41.968 318.899 41.472 319.827 40.48C320.787 39.456 321.267 38.048 321.267 36.256V29.344C321.267 27.552 320.787 26.16 319.827 25.168C318.899 24.144 317.619 23.632 315.987 23.632C314.291 23.632 312.963 24.128 312.003 25.12C311.043 26.08 310.563 27.488 310.563 29.344V36.256C310.563 38.112 311.043 39.536 312.003 40.528C312.963 41.488 314.291 41.968 315.987 41.968Z"
              fill="#ABB8CC"
            />
          </svg>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'DM Sans',
          data: mediumData,
          style: 'normal',
        },
        {
          name: 'DM Sans Bold',
          data: boldData,
          style: 'normal',
        },
        {
          name: 'JetBrains Mono',
          data: monoData,
          style: 'normal',
        },
      ],
    }
  );
}
